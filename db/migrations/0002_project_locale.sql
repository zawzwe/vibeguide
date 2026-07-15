ALTER TABLE "projects"
ADD COLUMN IF NOT EXISTS "locale" varchar(10) DEFAULT 'zh' NOT NULL;
