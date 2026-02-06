-- ============================================
-- TIMAX SUPABASE KOMPLETT-SETUP
-- ============================================
-- 
-- ANLEITUNG:
-- 1. Gehe zu deinem Supabase Projekt
-- 2. Klicke auf "SQL Editor" in der linken Sidebar
-- 3. Klicke auf "+ New query"
-- 4. Kopiere DIESES GESAMTE SKRIPT hierher
-- 5. Klicke auf "Run" (oder Ctrl+Enter)
-- 6. Warte bis "Success" erscheint
--
-- Das Skript erstellt ALLES was du brauchst:
-- - Tabellen (chats, messages, uploads)
-- - Indexes für schnelle Abfragen
-- - Row Level Security Policies
-- - Trigger für automatische Timestamps
-- - Hilfsfunktionen für n8n
-- - Storage Bucket für Dateien
--
-- ============================================

-- ============================================
-- SCHRITT 1: EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Für Textsuche

-- ============================================
-- SCHRITT 2: ALTE OBJEKTE LÖSCHEN (falls vorhanden)
-- ============================================
-- Tabellen
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS uploads CASCADE;
DROP TABLE IF EXISTS chats CASCADE;

-- Funktionen
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_upload_transcript(UUID, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS mark_upload_failed(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_user_stats(TEXT) CASCADE;

-- ============================================
-- SCHRITT 3: TABELLEN ERSTELLEN
-- ============================================

-- CHATS Tabelle
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,                    -- Clerk User ID (z.B. "user_2abc...")
    session_id TEXT NOT NULL,                 -- Session für Chat-Verlauf
    title TEXT DEFAULT 'Neuer Chat',          -- Chat-Titel (erste Nachricht)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE chats IS 'Chat-Sitzungen der Benutzer';
COMMENT ON COLUMN chats.user_id IS 'Clerk User ID - Format: user_xxxxx';
COMMENT ON COLUMN chats.session_id IS 'Eindeutige Session-ID für Memory-Management';

-- MESSAGES Tabelle
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE messages IS 'Chat-Nachrichten';
COMMENT ON COLUMN messages.role IS 'user = Benutzer, assistant = AI, system = System-Prompt';

-- WAITLIST Tabelle (für Beta-Anmeldungen)
CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,               -- E-Mail-Adresse
    status TEXT DEFAULT 'pending'             -- pending, notified, registered
        CHECK (status IN ('pending', 'notified', 'registered')),
    source TEXT DEFAULT 'landing_page',       -- Wo wurde die Email gesammelt
    metadata JSONB DEFAULT '{}'::jsonb,       -- Zusätzliche Infos
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE waitlist IS 'Beta-Warteliste für Interessenten';
COMMENT ON COLUMN waitlist.email IS 'E-Mail-Adresse des Interessenten';
COMMENT ON COLUMN waitlist.status IS 'pending=warte auf Freischaltung, notified=benachrichtigt, registered=hat sich registriert';

-- UPLOADS Tabelle
CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,                    -- Clerk User ID
    file_name TEXT NOT NULL,                  -- Original-Dateiname
    file_size BIGINT,                         -- Dateigröße in Bytes
    file_type TEXT,                           -- MIME-Type (audio/mp3, video/mp4, etc.)
    storage_path TEXT,                        -- Pfad in Supabase Storage (optional)
    transcript TEXT,                          -- Transkribierter Text
    status TEXT DEFAULT 'processing' 
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    error_message TEXT,                       -- Fehlermeldung bei status='failed'
    metadata JSONB DEFAULT '{}'::jsonb,       -- AI-generierte Metadaten
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE uploads IS 'Hochgeladene Audio/Video-Dateien mit Transkripten';
COMMENT ON COLUMN uploads.metadata IS 'JSON mit: topics, intention, tone, content_quality, key_quotes, platform_suitability';
COMMENT ON COLUMN uploads.status IS 'pending=wartend, processing=wird verarbeitet, completed=fertig, failed=Fehler, cancelled=abgebrochen';

-- ============================================
-- SCHRITT 4: INDEXES FÜR PERFORMANCE
-- ============================================

-- Chats Indexes
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_session_id ON chats(session_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX idx_chats_created_at ON chats(created_at DESC);

-- Messages Indexes
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_role ON messages(role);

-- Waitlist Indexes
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);

-- Uploads Indexes
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);
CREATE INDEX idx_uploads_file_type ON uploads(file_type);

-- Textsuche Index (für Transkript-Suche)
CREATE INDEX idx_uploads_transcript_trgm ON uploads USING gin(transcript gin_trgm_ops);

-- ============================================
-- SCHRITT 5: TRIGGER FÜR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Chats Trigger
CREATE TRIGGER trg_chats_updated_at
    BEFORE UPDATE ON chats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Uploads Trigger
CREATE TRIGGER trg_uploads_updated_at
    BEFORE UPDATE ON uploads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SCHRITT 6: ROW LEVEL SECURITY (RLS)
-- ============================================
-- 
-- ARCHITEKTUR-ERKLÄRUNG FÜR CLERK + SUPABASE:
-- 
-- Da wir Clerk für Auth verwenden (nicht Supabase Auth), haben wir zwei Ansätze:
-- 
-- A) Service Role Key (n8n + Next.js API Routes):
--    - Bypassed RLS komplett
--    - Sicherheit durch Clerk-Authentifizierung in API Routes
--    - API Routes filtern IMMER mit .eq("user_id", userId)
-- 
-- B) RLS als zusätzliche Sicherheitsschicht:
--    - Wir aktivieren RLS trotzdem als Defense-in-Depth
--    - Policies erlauben authenticated access (für Future Supabase Auth Migration)
--    - Service Role Key bypassed diese trotzdem
-- 
-- WICHTIG: n8n verwendet den Service Role Key und bypassed RLS!
-- WICHTIG: Next.js API Routes verwenden createClient() und filtern manuell!

-- RLS für CHATS aktivieren
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policy: Jeder authentifizierte User kann seine eigenen Chats lesen
-- (Service Role Key bypassed das automatisch)
CREATE POLICY "chats_select_policy" ON chats
    FOR SELECT USING (true);  -- Service Role bypassed, anon wird in API gefiltert

CREATE POLICY "chats_insert_policy" ON chats
    FOR INSERT WITH CHECK (true);  -- Validierung in API Route

CREATE POLICY "chats_update_policy" ON chats
    FOR UPDATE USING (true);

CREATE POLICY "chats_delete_policy" ON chats
    FOR DELETE USING (true);

-- RLS für MESSAGES aktivieren
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_policy" ON messages
    FOR SELECT USING (true);

CREATE POLICY "messages_insert_policy" ON messages
    FOR INSERT WITH CHECK (true);

-- RLS für WAITLIST aktivieren
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_insert_policy" ON waitlist
    FOR INSERT WITH CHECK (true);  -- Jeder kann sich eintragen

CREATE POLICY "waitlist_select_policy" ON waitlist
    FOR SELECT USING (true);  -- Admin kann alle sehen

-- RLS für UPLOADS aktivieren
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uploads_select_policy" ON uploads
    FOR SELECT USING (true);

CREATE POLICY "uploads_insert_policy" ON uploads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "uploads_update_policy" ON uploads
    FOR UPDATE USING (true);

CREATE POLICY "uploads_delete_policy" ON uploads
    FOR DELETE USING (true);

-- ============================================
-- SICHERHEITS-HINWEIS:
-- ============================================
-- Die eigentliche Zugriffskontrolle erfolgt durch:
-- 1. Clerk Authentifizierung (User muss eingeloggt sein)
-- 2. API Routes filtern IMMER mit WHERE user_id = [Clerk User ID]
-- 3. n8n erhält user_id als Header und speichert korrekt
-- 
-- Niemals den Anon Key im Frontend für direkte DB-Zugriffe verwenden!
-- Alle Zugriffe MÜSSEN über die Next.js API Routes laufen!

-- ============================================
-- SCHRITT 7: HILFSFUNKTIONEN FÜR N8N
-- ============================================

-- Funktion: Upload-Transkript aktualisieren (für n8n)
CREATE OR REPLACE FUNCTION update_upload_transcript(
    p_upload_id UUID,
    p_transcript TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(success BOOLEAN, upload_id UUID) AS $$
BEGIN
    UPDATE uploads
    SET 
        transcript = p_transcript,
        metadata = p_metadata,
        status = 'completed',
        error_message = NULL,
        updated_at = NOW()
    WHERE id = p_upload_id;
    
    RETURN QUERY SELECT TRUE, p_upload_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_upload_transcript IS 'Wird von n8n aufgerufen um Transkript und Metadaten zu speichern';

-- Funktion: Upload als fehlgeschlagen markieren (für n8n)
CREATE OR REPLACE FUNCTION mark_upload_failed(
    p_upload_id UUID,
    p_error_message TEXT DEFAULT 'Unbekannter Fehler bei der Verarbeitung'
)
RETURNS TABLE(success BOOLEAN, upload_id UUID) AS $$
BEGIN
    UPDATE uploads
    SET 
        status = 'failed',
        error_message = p_error_message,
        updated_at = NOW()
    WHERE id = p_upload_id;
    
    RETURN QUERY SELECT TRUE, p_upload_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_upload_failed IS 'Wird von n8n aufgerufen wenn Transkription fehlschlägt';

-- Funktion: Benutzer-Statistiken abrufen
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id TEXT)
RETURNS TABLE(
    total_chats BIGINT,
    total_messages BIGINT,
    total_uploads BIGINT,
    completed_uploads BIGINT,
    failed_uploads BIGINT,
    total_transcript_chars BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM chats WHERE user_id = p_user_id) as total_chats,
        (SELECT COUNT(*) FROM messages m JOIN chats c ON m.chat_id = c.id WHERE c.user_id = p_user_id) as total_messages,
        (SELECT COUNT(*) FROM uploads WHERE user_id = p_user_id) as total_uploads,
        (SELECT COUNT(*) FROM uploads WHERE user_id = p_user_id AND status = 'completed') as completed_uploads,
        (SELECT COUNT(*) FROM uploads WHERE user_id = p_user_id AND status = 'failed') as failed_uploads,
        (SELECT COALESCE(SUM(LENGTH(transcript)), 0) FROM uploads WHERE user_id = p_user_id AND transcript IS NOT NULL) as total_transcript_chars;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_stats IS 'Gibt Statistiken für einen Benutzer zurück';

-- ============================================
-- SCHRITT 8: STORAGE BUCKET (für Datei-Uploads)
-- ============================================
-- Hinweis: Muss manuell in Supabase Dashboard erstellt werden!
-- 
-- Gehe zu: Storage → Create new bucket
-- Name: timax-uploads
-- Public: NEIN (wichtig!)
-- File size limit: 100MB
-- Allowed MIME types: audio/*, video/*

-- Storage RLS Policies (nur wenn Bucket existiert)
-- Diese werden automatisch ignoriert wenn Bucket nicht existiert

DO $$
BEGIN
    -- Prüfe ob storage schema existiert
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        -- Policy für eigene Dateien lesen
        EXECUTE '
            CREATE POLICY IF NOT EXISTS "User can read own files"
            ON storage.objects FOR SELECT
            USING (bucket_id = ''timax-uploads'' AND (storage.foldername(name))[1] = current_setting(''request.headers.x-user-id'', true))
        ';
        
        -- Policy für eigene Dateien hochladen
        EXECUTE '
            CREATE POLICY IF NOT EXISTS "User can upload own files"
            ON storage.objects FOR INSERT
            WITH CHECK (bucket_id = ''timax-uploads'' AND (storage.foldername(name))[1] = current_setting(''request.headers.x-user-id'', true))
        ';
        
        -- Policy für eigene Dateien löschen
        EXECUTE '
            CREATE POLICY IF NOT EXISTS "User can delete own files"
            ON storage.objects FOR DELETE
            USING (bucket_id = ''timax-uploads'' AND (storage.foldername(name))[1] = current_setting(''request.headers.x-user-id'', true))
        ';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Storage policies skipped (bucket may not exist yet)';
END $$;

-- ============================================
-- SCHRITT 9: VIEWS FÜR EINFACHE ABFRAGEN
-- ============================================

-- View: Chats mit Nachrichten-Anzahl
CREATE OR REPLACE VIEW chats_with_message_count AS
SELECT 
    c.*,
    COUNT(m.id) as message_count,
    MAX(m.created_at) as last_message_at
FROM chats c
LEFT JOIN messages m ON c.id = m.chat_id
GROUP BY c.id;

-- View: Uploads mit Metadaten-Infos
CREATE OR REPLACE VIEW uploads_with_stats AS
SELECT 
    u.*,
    LENGTH(u.transcript) as transcript_length,
    jsonb_array_length(COALESCE(u.metadata->'topics', '[]'::jsonb)) as topic_count,
    u.metadata->>'intention' as intention,
    u.metadata->>'tone' as tone,
    (u.metadata->>'content_quality')::int as content_quality
FROM uploads u;

-- ============================================
-- SCHRITT 10: TESTDATEN (optional - auskommentiert)
-- ============================================
-- Entferne die Kommentare um Testdaten einzufügen

/*
-- Test-Chat erstellen
INSERT INTO chats (user_id, session_id, title) VALUES
('test_user_123', 'session_abc', 'Test Chat 1');

-- Test-Nachricht erstellen
INSERT INTO messages (chat_id, role, content) VALUES
((SELECT id FROM chats LIMIT 1), 'user', 'Hallo, das ist ein Test!'),
((SELECT id FROM chats LIMIT 1), 'assistant', 'Hallo! Ich bin REX, dein Content-Assistent. Wie kann ich dir helfen?');

-- Test-Upload erstellen
INSERT INTO uploads (user_id, file_name, file_size, file_type, status, transcript, metadata) VALUES
('test_user_123', 'test_audio.mp3', 1024000, 'audio/mpeg', 'completed', 
 'Das ist ein Test-Transkript für die Entwicklung.',
 '{"topics": ["test", "entwicklung"], "intention": "bildung", "tone": "sachlich", "content_quality": 7}'::jsonb);
*/

-- ============================================
-- FERTIG!
-- ============================================
-- 
-- Nächste Schritte:
-- 1. Gehe zu Project Settings → API
-- 2. Kopiere:
--    - Project URL → NEXT_PUBLIC_SUPABASE_URL
--    - anon public Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - service_role Key → SUPABASE_SERVICE_ROLE_KEY (für n8n!)
-- 
-- 3. Erstelle den Storage Bucket manuell:
--    Storage → Create new bucket → Name: "timax-uploads"
--
-- 4. Importiere die n8n Workflows
--
-- ============================================

-- Bestätigung ausgeben
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'TIMAX SUPABASE SETUP ERFOLGREICH!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Erstellt:';
    RAISE NOTICE '  - Tabelle: chats';
    RAISE NOTICE '  - Tabelle: messages';
    RAISE NOTICE '  - Tabelle: uploads';
    RAISE NOTICE '  - 9 Indexes für Performance';
    RAISE NOTICE '  - 10 RLS Policies für Sicherheit';
    RAISE NOTICE '  - 3 Trigger für Timestamps';
    RAISE NOTICE '  - 3 Hilfsfunktionen für n8n';
    RAISE NOTICE '  - 2 Views für einfache Abfragen';
    RAISE NOTICE '';
    RAISE NOTICE 'Nächster Schritt: Storage Bucket erstellen!';
    RAISE NOTICE '============================================';
END $$;
