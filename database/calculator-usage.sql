-- Calculator Usage Tracking for Social Proof Counter
-- Track how many times each calculator is used

CREATE TABLE IF NOT EXISTS calculator_usage (
  id BIGSERIAL PRIMARY KEY,
  calculator_type TEXT NOT NULL, -- 'card_offers', 'debt_trap', 'student_cards', 'emergency_fund', 'car_vs_uber'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast counting
CREATE INDEX IF NOT EXISTS idx_calculator_type ON calculator_usage(calculator_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON calculator_usage(created_at);

-- Enable Row Level Security
ALTER TABLE calculator_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read usage counts (public data)
CREATE POLICY "Anyone can read calculator usage"
  ON calculator_usage
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert (prevents spam)
-- NOTE: For anonymous tracking, change this to USING (true)
CREATE POLICY "Anyone can track usage"
  ON calculator_usage
  FOR INSERT
  WITH CHECK (true);

-- View for easy counting
CREATE OR REPLACE VIEW calculator_usage_counts AS
SELECT 
  calculator_type,
  COUNT(*) as usage_count,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as last_7_days,
  COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_30_days
FROM calculator_usage
GROUP BY calculator_type;

-- Grant permissions
GRANT SELECT ON calculator_usage_counts TO anon, authenticated;
