CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL,
    about text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    img text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default" NOT NULL,
    is_admin boolean DEFAULT false,
    is_writer boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    refresh_token text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_name UNIQUE (name),
    CONSTRAINT users_email_unique UNIQUE (email)
)