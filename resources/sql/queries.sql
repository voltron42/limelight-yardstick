-- init-users-table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


-- init-sessions-table
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)


-- init-user-preferences-table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  custom_username TEXT UNIQUE,
  is_profile_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


-- init-ratings-table
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
)


-- init-vocabulary-table
CREATE TABLE IF NOT EXISTS vocabulary (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  level INTEGER NOT NULL,
  term TEXT NOT NULL,
  UNIQUE(category, level)
)


-- seed-vocabulary
INSERT INTO vocabulary (category, level, term) VALUES
  ('Daring', 1, 'Dogmatic'),
  ('Daring', 2, 'Formulaic'),
  ('Daring', 3, 'Creative'),
  ('Daring', 4, 'Provocative'),
  ('Ambition', 1, 'Lazy'),
  ('Ambition', 2, 'Rushed'),
  ('Ambition', 3, 'Aspiring'),
  ('Ambition', 4, 'Masterful'),
  ('Engagement', 1, 'Punishing'),
  ('Engagement', 2, 'Uneven'),
  ('Engagement', 3, 'Engaging'),
  ('Engagement', 4, 'Irresistible'),
  ('Satisfaction', 1, 'Contemptible'),
  ('Satisfaction', 2, 'Unremarkable'),
  ('Satisfaction', 3, 'Rewarding'),
  ('Satisfaction', 4, 'Unforgettable')


-- init-rating-terms-table
CREATE TABLE IF NOT EXISTS rating_terms (
  id SERIAL PRIMARY KEY,
  rating_id INTEGER NOT NULL REFERENCES ratings(id) ON DELETE CASCADE,
  term_id INTEGER NOT NULL REFERENCES vocabulary(id),
  category TEXT NOT NULL,
  order INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(rating_id, category),
  UNIQUE(rating_id, order)
)


-- count-vocabulary
SELECT COUNT(*) as cnt FROM vocabulary


-- get-vocabulary
SELECT id, category, level, term 
FROM vocabulary ORDER BY category, level


-- upsert-user-check-existing
SELECT id FROM users WHERE google_id = ?


-- upsert-user-update
UPDATE users SET name = ?, profile_picture = ?, updated_at = ? WHERE google_id = ?


-- upsert-user-insert
INSERT INTO users (google_id, email, name, profile_picture) VALUES (?, ?, ?, ?)


-- get-user-by-id
SELECT id, email, name, profile_picture, created_at FROM users WHERE id = ?


-- get-preferences-existing
SELECT * FROM user_preferences WHERE user_id = ?


-- create-preferences
INSERT INTO user_preferences (user_id, custom_username, is_profile_public) VALUES (?, ?, ?)


-- update-preferences
UPDATE user_preferences SET custom_username = ?, is_profile_public = ?, updated_at = ? WHERE user_id = ?


-- get-rating-by-id
SELECT id FROM ratings WHERE user_id = ? AND movie_id = ?


-- create-rating
INSERT INTO ratings (user_id, movie_id) VALUES (?, ?)


-- get-vocabulary-for-term
SELECT category FROM vocabulary WHERE id = ?


-- insert-rating-term
INSERT INTO rating_terms (rating_id, term_id, category, order) VALUES (?, ?, ?, ?)


-- delete-rating-terms
DELETE FROM rating_terms WHERE rating_id = ?


-- get-user-ratings
SELECT id, movie_id, created_at, updated_at 
FROM ratings WHERE user_id = ? ORDER BY updated_at DESC


-- get-rating-terms
SELECT rt.id, v.id as term_id, v.category, v.level, v.term 
FROM rating_terms rt 
JOIN vocabulary v ON rt.term_id = v.id 
WHERE rt.rating_id = ? 
ORDER BY rt.order


-- get-movie-ratings
SELECT r.user_id, r.created_at 
FROM ratings r 
WHERE r.movie_id = ?

-- get-movie-rating-terms
SELECT rt.id, v.id as term_id, v.category, v.level, v.term 
FROM rating_terms rt 
JOIN vocabulary v ON rt.term_id = v.id 
WHERE rt.rating_id = (SELECT id FROM ratings WHERE user_id = ? AND movie_id = ?) 
ORDER BY rt.order


-- get-public-user-by-username
SELECT u.id, u.name, u.profile_picture, up.custom_username 
FROM users u JOIN user_preferences up ON u.id = up.user_id 
WHERE up.custom_username = ? AND up.is_profile_public = TRUE

  
-- get-public-users
SELECT u.id, u.name, u.profile_picture, up.custom_username 
FROM users u JOIN user_preferences up ON u.id = up.user_id 
WHERE up.is_profile_public = TRUE 
ORDER BY u.created_at DESC
