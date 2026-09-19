CREATE TABLE IF NOT EXISTS public.email_verifications
(
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text NOT NULL,
    purpose text NOT NULL CHECK (purpose IN ('registration', 'password_reset')),
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);