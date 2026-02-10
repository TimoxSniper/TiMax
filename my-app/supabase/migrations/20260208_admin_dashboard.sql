-- Admin Dashboard Migration
-- Creates admin_logs and user_bans tables, adds soft delete columns to chats and uploads

-- ============================================
-- 1. ADMIN LOGS TABLE (Audit Trail)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for admin_logs
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_type, target_id) WHERE target_type IS NOT NULL;

-- ============================================
-- 2. USER BANS TABLE (User Suspensions)
-- ============================================
CREATE TABLE IF NOT EXISTS user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  banned_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  ban_type TEXT NOT NULL CHECK (ban_type IN ('temporary', 'permanent')),
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user_bans
CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_expires_at ON user_bans(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_bans_ban_type ON user_bans(ban_type);

-- ============================================
-- 3. ADD SOFT DELETE TO CHATS
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'chats' AND column_name = 'deleted_at') THEN
    ALTER TABLE chats ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'chats' AND column_name = 'deleted_by') THEN
    ALTER TABLE chats ADD COLUMN deleted_by TEXT;
  END IF;
END $$;

-- Index for soft deleted chats
CREATE INDEX IF NOT EXISTS idx_chats_deleted_at ON chats(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================
-- 4. ADD SOFT DELETE TO UPLOADS
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'uploads' AND column_name = 'deleted_at') THEN
    ALTER TABLE uploads ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'uploads' AND column_name = 'deleted_by') THEN
    ALTER TABLE uploads ADD COLUMN deleted_by TEXT;
  END IF;
END $$;

-- Index for soft deleted uploads
CREATE INDEX IF NOT EXISTS idx_uploads_deleted_at ON uploads(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on admin tables
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage admin_logs" ON admin_logs;
DROP POLICY IF EXISTS "Service role can manage user_bans" ON user_bans;

-- Admin logs: Service role only
CREATE POLICY "Service role can manage admin_logs"
  ON admin_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- User bans: Service role only
CREATE POLICY "Service role can manage user_bans"
  ON user_bans
  FOR ALL
  USING (auth.role() = 'service_role');

-- Note: RLS policies for chats and uploads to exclude deleted items
-- will be handled in application logic for better performance
-- Users with auth.uid() matching user_id will be filtered in queries

-- ============================================
-- 6. TRIGGER FOR USER BANS UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_user_bans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_bans_updated_at ON user_bans;

CREATE TRIGGER trigger_user_bans_updated_at
  BEFORE UPDATE ON user_bans
  FOR EACH ROW
  EXECUTE FUNCTION update_user_bans_updated_at();

-- ============================================
-- 7. HELPFUL VIEWS FOR ADMINS
-- ============================================

-- View for active (non-deleted) chats with message counts
CREATE OR REPLACE VIEW admin_chats_overview AS
SELECT
  c.id,
  c.user_id,
  c.session_id,
  c.title,
  c.created_at,
  c.updated_at,
  c.deleted_at,
  c.deleted_by,
  COUNT(m.id) as message_count,
  MAX(m.created_at) as last_message_at
FROM chats c
LEFT JOIN messages m ON c.id = m.chat_id
GROUP BY c.id, c.user_id, c.session_id, c.title, c.created_at, c.updated_at, c.deleted_at, c.deleted_by;

-- View for uploads with status statistics
CREATE OR REPLACE VIEW admin_uploads_overview AS
SELECT
  id,
  user_id,
  file_name,
  file_size,
  file_type,
  storage_path,
  status,
  error_message,
  created_at,
  updated_at,
  deleted_at,
  deleted_by,
  CASE
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    ELSE status::TEXT
  END as effective_status
FROM uploads;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
