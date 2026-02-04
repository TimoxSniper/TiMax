-- ============================================
-- TiMax Supabase Schema (für Clerk Integration)
-- ============================================

-- 1. CHATS TABLE
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Clerk User ID (z.B. "user_123abc")
  session_id TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MESSAGES TABLE
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. UPLOADS TABLE
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Clerk User ID
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  transcript TEXT,
  status TEXT DEFAULT 'processing',
  metadata JSONB DEFAULT '{}',  -- Für AI-Metadaten (topics, intention, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INDEXES für Performance
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_session_id ON chats(session_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_uploads_user_id ON uploads(user_id);

-- 5. ROW LEVEL SECURITY (RLS) - WICHTIG!

-- Chats RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  USING (user_id = current_setting('request.headers.x-user-id', true));

CREATE POLICY "Users can insert own chats"
  ON chats FOR INSERT
  WITH CHECK (user_id = current_setting('request.headers.x-user-id', true));

CREATE POLICY "Users can update own chats"
  ON chats FOR UPDATE
  USING (user_id = current_setting('request.headers.x-user-id', true));

CREATE POLICY "Users can delete own chats"
  ON chats FOR DELETE
  USING (user_id = current_setting('request.headers.x-user-id', true));

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = current_setting('request.headers.x-user-id', true)
    )
  );

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = current_setting('request.headers.x-user-id', true)
    )
  );

-- Uploads RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own uploads"
  ON uploads FOR SELECT
  USING (user_id = current_setting('request.headers.x-user-id', true));

CREATE POLICY "Users can insert own uploads"
  ON uploads FOR INSERT
  WITH CHECK (user_id = current_setting('request.headers.x-user-id', true));

CREATE POLICY "Users can delete own uploads"
  ON uploads FOR DELETE
  USING (user_id = current_setting('request.headers.x-user-id', true));

-- 6. STORAGE BUCKET (optional, falls du Dateien speichern willst)
-- Gehe zu Storage → New Bucket → Name: "uploads", Public: false

-- 7. TRIGGER für updated_at (optional)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
