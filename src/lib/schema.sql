CREATE TABLE
  user_session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP,
    user_agent TEXT,
    referrer TEXT,
    session_duration INTEGER, -- in seconds
    page_count INTEGER DEFAULT 0
  );

CREATE TABLE
  page_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    date_grouping TEXT NOT NULL,
    pageviews INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    uniques INTEGER DEFAULT 0,
    avg_duration REAL, -- average duration in seconds
    bounce_rate REAL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );