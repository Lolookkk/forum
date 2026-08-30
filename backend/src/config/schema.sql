DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS private_messages CASCADE;
DROP TABLE IF EXISTS zoom_events CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS fiches CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS useful_number_categories CASCADE;
DROP TABLE IF EXISTS useful_numbers CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'membre' CHECK(role IN ('membre', 'moderateur', 'admin')),
    description TEXT DEFAULT '',
    is_banned BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    display_order SERIAL NOT NULL
);

CREATE TABLE subcategories (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    display_order SERIAL NOT NULL
);

CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    subcategory_id INT NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'publie' CHECK(status IN ('publie', 'signale', 'masque', 'supprime')),
    report_count INT DEFAULT 0 NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    topic_id INT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'publie' CHECK(status IN ('publie', 'signale', 'masque','supprime')),
    report_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    moderator_id INT NULL REFERENCES users(id) ON DELETE SET NULL,
    topic_id INT NULL REFERENCES topics(id) ON DELETE SET NULL,
    post_id INT NULL REFERENCES posts(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    CHECK (
        (topic_id IS NOT NULL AND post_id IS NULL)
        OR
        (topic_id IS NULL AND post_id IS NOT NULL)
        OR
        (topic_id IS NULL AND post_id IS NULL AND is_resolved = TRUE)
    )
);

CREATE TABLE zoom_events (
    id SERIAL PRIMARY KEY,
    organizer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    zoom_url VARCHAR(500) NOT NULL,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE private_messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE post_likes (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

-- schema.sql
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fiches (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  icon_color VARCHAR(50) NOT NULL,
  content TEXT, -- Contenu complet au format Markdown ou HTML
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories de numéros utiles
CREATE TABLE useful_number_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  position SERIAL NOT NULL
);

-- Table des numéros utiles
CREATE TABLE useful_numbers (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES useful_number_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  number VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  badge VARCHAR(100) NOT NULL,
  urgent BOOLEAN DEFAULT FALSE,
  chat VARCHAR(255),
  url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  forum_name VARCHAR(255) NOT NULL DEFAULT 'Safe Space',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  topics_per_page INT NOT NULL DEFAULT 10,
  registration_open BOOLEAN NOT NULL DEFAULT true
);