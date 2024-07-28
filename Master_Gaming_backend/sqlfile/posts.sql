-- Table: public.posts

-- DROP TABLE IF EXISTS public.posts;

CREATE TABLE IF NOT EXISTS public.posts
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id bigint,
    title text COLLATE pg_catalog."default" NOT NULL,
    img text COLLATE pg_catalog."default" NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.posts
    OWNER to avnadmin;

COMMENT ON TABLE public.posts
    IS 'Posts about game';