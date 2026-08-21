CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    sap_id TEXT UNIQUE,
    name TEXT NOT NULL,
    role TEXT,
    experience_years INTEGER,
    location TEXT,
    status TEXT DEFAULT 'Available',
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    candidate_id TEXT,

    original_filename TEXT NOT NULL,
    stored_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,

    processing_status TEXT DEFAULT 'PENDING',
    raw_text TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,

    justification TEXT,
    experience_years REAL,
    source_resume_id TEXT,

    PRIMARY KEY (candidate_id, skill_id),

    FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE,

    FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE,

    FOREIGN KEY (source_resume_id)
        REFERENCES resumes(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_candidates_sap_id
ON candidates(sap_id);

CREATE INDEX IF NOT EXISTS idx_candidates_location
ON candidates(location);

CREATE INDEX IF NOT EXISTS idx_candidates_role
ON candidates(role);

CREATE INDEX IF NOT EXISTS idx_skills_name
ON skills(name);

CREATE INDEX IF NOT EXISTS idx_resumes_candidate_id
ON resumes(candidate_id);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_id
ON candidate_skills(candidate_id);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill_id
ON candidate_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_candidate_skills_source_resume_id
ON candidate_skills(source_resume_id);

CREATE TABLE IF NOT EXISTS job_descriptions (
    id TEXT PRIMARY KEY,

    raw_text TEXT NOT NULL,
    role TEXT,
    location TEXT,
    experience_min INTEGER,
    experience_max INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_results (
    id TEXT PRIMARY KEY,

    jd_id TEXT NOT NULL,
    candidate_id TEXT,
    sap_id TEXT,
    candidate_name TEXT,

    score INTEGER NOT NULL,
    rank INTEGER,
    reasoning TEXT,

    matching_summary TEXT,
    matched_skills TEXT,
    unmatched_jd_skills TEXT,
    additional_candidate_skills TEXT,
    assessment_insights TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (jd_id)
        REFERENCES job_descriptions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_match_results_jd_id
ON match_results(jd_id);

CREATE INDEX IF NOT EXISTS idx_match_results_candidate_id
ON match_results(candidate_id);

CREATE INDEX IF NOT EXISTS idx_match_results_score
ON match_results(score);