-- Seed data for 5BulletMethod app

-- Insert sample entries for the test user
INSERT INTO bullet_entries (user_id, week_start_date) VALUES
('test-user', date('now', '-14 days')),
('test-user', date('now', '-7 days'));

-- Get the entry IDs
-- Note: In a real scenario, you'd use the actual IDs returned from the inserts above

-- Insert sample bullet items for the first entry (2 weeks ago)
INSERT INTO bullet_items (bullet_entry_id, item_order, emoji, text, category) VALUES
(1, 1, '🏃', 'Ran 5 miles', 'health'),
(1, 2, '📚', 'Read 50 pages of a novel', 'personal'),
(1, 3, '🍳', 'Tried a new recipe', 'cooking'),
(1, 4, '🎵', 'Practiced guitar for 30 minutes', 'hobby'),
(1, 5, '👨‍👩‍👧‍👦', 'Family game night', 'relationships');

-- Insert sample bullet items for the second entry (1 week ago)
INSERT INTO bullet_items (bullet_entry_id, item_order, emoji, text, category) VALUES
(2, 1, '💼', 'Completed project milestone', 'work'),
(2, 2, '🧘', 'Morning meditation', 'health'),
(2, 3, '🌱', 'Planted herbs in garden', 'home'),
(2, 4, '📞', 'Called grandparents', 'relationships'),
(2, 5, '🎬', 'Watched a documentary', 'learning');

-- Insert AI insights for the entries
INSERT INTO ai_insights (bullet_entry_id, insight_text) VALUES
(1, 'You''re staying balanced across life areas!'),
(2, 'You''re staying balanced across life areas!');
