-- Seed sample data
DELETE FROM AIInsight;
DELETE FROM BulletItem;
DELETE FROM BulletEntry;

-- Insert 3 weeks for test-user, last two weeks and current week
INSERT INTO BulletEntry (user_id, week_start_date, created_at)
VALUES
('test-user', DATE('now','weekday 1','-14 days'), DATETIME('now','-14 days')),
('test-user', DATE('now','weekday 1','-7 days'), DATETIME('now','-7 days')),
('test-user', DATE('now','weekday 1'), DATETIME('now'));

-- Items for first seeded entry (2 weeks ago)
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category)
SELECT id, 1, '⚖️', 'Lost 2 pounds', 'health' FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-14 days') AND user_id='test-user';
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category)
SELECT id, 2, '☎️', 'Called mom', 'relationships' FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-14 days') AND user_id='test-user';
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category)
SELECT id, 3, '🚗', 'Got oil change', 'car' FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-14 days') AND user_id='test-user';

-- Items for second seeded entry (1 week ago)
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category)
SELECT id, 1, '💅', 'Nails done', 'health' FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-7 days') AND user_id='test-user';
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category)
SELECT id, 2, '🎶', 'Went to Karaoke', 'social' FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-7 days') AND user_id='test-user';
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category)
SELECT id, 3, '📚', 'Read a book', 'personal growth' FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-7 days') AND user_id='test-user';

-- Insight for last week
INSERT INTO AIInsight (bullet_entry_id, insight_text, generated_at)
SELECT id, 'You''re staying balanced across life areas!', DATETIME('now','-6 days')
FROM BulletEntry WHERE week_start_date = DATE('now','weekday 1','-7 days') AND user_id='test-user';
