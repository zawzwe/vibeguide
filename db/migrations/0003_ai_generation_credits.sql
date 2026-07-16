CREATE TABLE IF NOT EXISTS public.ai_generations (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  locale varchar(10) DEFAULT 'zh' NOT NULL,
  status varchar(20) DEFAULT 'processing' NOT NULL,
  credit_charged boolean DEFAULT false NOT NULL,
  documents jsonb,
  error text,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS ai_generations_user_id_idx
ON public.ai_generations (user_id);

CREATE INDEX IF NOT EXISTS ai_generations_status_updated_at_idx
ON public.ai_generations (status, updated_at);
