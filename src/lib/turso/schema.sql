CREATE TABLE
  user_session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    user_agent TEXT,
    referrer TEXT,
    session_duration INTEGER,
    page_count INTEGER DEFAULT 0
  );

CREATE TABLE
  page_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    slug TEXT NOT NULL,
    pageviews INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    uniques INTEGER DEFAULT 0,
    avg_duration REAL,
    bounce_rate REAL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  page_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  session_geolocation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    city TEXT,
    region TEXT,
    country TEXT,
    location TEXT,
    timezone TEXT
  );