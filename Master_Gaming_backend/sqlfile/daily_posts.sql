CREATE TABLE IF NOT EXISTS public.daily_posts
(
    selection_date date NOT NULL DEFAULT CURRENT_DATE,
    post_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT daily_posts_pkey PRIMARY KEY (selection_date),
    CONSTRAINT daily_posts_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.posts (id)
);