-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('book', 'video', 'podcast', 'article');

-- CreateTable
CREATE TABLE "mentors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "style" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "bio" TEXT,
    "bodyLanguage" TEXT,
    "era" TEXT,
    "mindset" TEXT,
    "philosophy" TEXT,
    "speakingStyle" TEXT,
    "archetype" TEXT,
    "avatar_url" TEXT,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_topics" (
    "mentorId" UUID NOT NULL,
    "topicId" UUID NOT NULL,

    CONSTRAINT "mentor_topics_pkey" PRIMARY KEY ("mentorId","topicId")
);

-- CreateTable
CREATE TABLE "book_video_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_title" TEXT NOT NULL,
    "source_type" "source_type" NOT NULL,
    "creator" TEXT,
    "source_url" TEXT,
    "file_path" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "mentor_id" UUID,

    CONSTRAINT "book_video_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_ideas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" UUID NOT NULL,
    "idea_text" TEXT NOT NULL,
    "core" TEXT,
    "importance" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "application" TEXT,
    "example" TEXT,
    "topic_id" UUID,

    CONSTRAINT "source_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mentor_id" UUID NOT NULL,
    "quote" TEXT NOT NULL,
    "photo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentors_name_key" ON "mentors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");

-- CreateIndex
CREATE INDEX "source_ideas_source_id_idx" ON "source_ideas"("source_id");

-- AddForeignKey
ALTER TABLE "mentor_topics" ADD CONSTRAINT "mentor_topics_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_topics" ADD CONSTRAINT "mentor_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_video_sources" ADD CONSTRAINT "book_video_sources_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_ideas" ADD CONSTRAINT "source_ideas_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "book_video_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_ideas" ADD CONSTRAINT "source_ideas_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
