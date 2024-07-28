-- Table: public.post_tags

-- DROP TABLE IF EXISTS public.post_tags;

CREATE TABLE IF NOT EXISTS public.post_tags
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    post_id bigint NOT NULL,
    tag_id bigint NOT NULL,
    CONSTRAINT post_tags_pkey PRIMARY KEY (id),
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.post_tags
    OWNER to avnadmin;