-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name text COLLATE pg_catalog."default" NOT NULL UNIQUE,
    about text COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL UNIQUE,
    created_at timestamp without time zone NOT NULL,
    img text COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default" NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_writer BOOLEAN DEFAULT FALSE;
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to avnadmin;