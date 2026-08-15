CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    sap_id TEXT UNIQUE,
    name TEXT NOT NULL,
    role TEXT,
    experience_years INTEGER,
    location TEXT,
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,

    original_filename TEXT NOT NULL,
    stored_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,

    processing_status TEXT DEFAULT 'PENDING',
    raw_text TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_candidates_sap_id
ON candidates(sap_id);

CREATE INDEX IF NOT EXISTS idx_candidates_location
ON candidates(location);

CREATE INDEX IF NOT EXISTS idx_candidates_role
ON candidates(role);