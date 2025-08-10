-- Sample data for testing
INSERT INTO BulletEntry (user_id, week_start_date, created_at) VALUES ('test-user', '2025-08-04', '2025-08-04T09:00:00Z');
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (1, 1, '⚖️', 'Lost 5 pounds', 'health');
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (1, 2, '🚗', 'Got oil change', 'car');
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (1, 3, '💅', 'Nails done', 'health');
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (1, 4, '☎️', 'Called mom', 'relationships');
INSERT INTO BulletItem (bullet_entry_id, "order", emoji, text, category) VALUES (1, 5, '🎶', 'Went to Karaoke', 'social');
INSERT INTO AIInsight (bullet_entry_id, insight_text, generated_at) VALUES (1, "You're staying balanced across life areas!", '2025-08-04T09:01:00Z');
