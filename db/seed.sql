-- Seed data for 5BulletMethod app
-- Sample entries for testing

-- Insert sample bullet entries for test user
INSERT INTO bullet_entries (user_id, week_start_date) VALUES 
('test-user', '2025-01-27'), -- This week (assuming current date context)
('test-user', '2025-01-20'), -- Last week
('test-user', '2025-01-13'); -- Two weeks ago

-- Sample bullet items for this week
INSERT INTO bullet_items (bullet_entry_id, order_index, emoji, text, category) VALUES
-- This week's entry (id=1)
(1, 0, '⚖️', 'Lost 5 pounds', 'health'),
(1, 1, '🚗', 'Got oil change', 'car'),
(1, 2, '💅', 'Nails done', 'health'),
(1, 3, '☎️', 'Called mom', 'relationships'),
(1, 4, '🎶', 'Went to Karaoke', 'social'),

-- Last week's entry (id=2)
(2, 0, '💼', 'Finished big project at work', 'work'),
(2, 1, '🏃‍♂️', 'Ran 10K race', 'health'),
(2, 2, '📚', 'Read 2 books', 'learning'),
(2, 3, '🍳', 'Cooked dinner for friends', 'social'),

-- Two weeks ago (id=3)
(3, 0, '🏠', 'Organized home office', 'organization'),
(3, 1, '💰', 'Set up retirement savings', 'finance'),
(3, 2, '🎯', 'Completed coding bootcamp module', 'learning');

-- Sample AI insights
INSERT INTO ai_insights (bullet_entry_id, insight_text) VALUES
(1, 'You''re staying balanced across life areas!'),
(2, 'Great focus on personal development and health this week!'),
(3, 'Excellent work on long-term planning and skills development!');
