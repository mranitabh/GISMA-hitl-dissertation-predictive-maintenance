CREATE TABLE IF NOT EXISTS hitl_requests (

    id BIGSERIAL PRIMARY KEY,

    request_id VARCHAR(100) UNIQUE NOT NULL,

    asset_id VARCHAR(100) NOT NULL,

    predicted_rul DOUBLE PRECISION,

    priority VARCHAR(20),

    recommendation TEXT,

    explanation JSONB,

    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_HUMAN_REVIEW',

    human_decision VARCHAR(50),

    human_comment TEXT,

    modified_recommendation TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reviewed_at TIMESTAMPTZ,

    completed_at TIMESTAMPTZ
);