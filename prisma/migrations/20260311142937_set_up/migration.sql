-- CreateEnum
CREATE TYPE "source_type" AS ENUM ('book', 'video');

-- CreateTable
CREATE TABLE "mentors" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "bg_vibe" TEXT,
    "camera_angle" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_video_sources" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "source_title" TEXT NOT NULL,
    "source_type" "source_type" NOT NULL,
    "creator" TEXT,
    "source_url" TEXT,
    "file_path" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "book_video_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_ideas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "source_id" UUID NOT NULL,
    "idea_text" TEXT NOT NULL,
    "core" TEXT,
    "importance" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "source_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourite_ideas" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "person" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "place" TEXT,
    "photo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "favourite_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mentors_name_key" ON "mentors"("name");

-- CreateIndex
CREATE INDEX "source_ideas_source_id_idx" ON "source_ideas"("source_id");

-- AddForeignKey
ALTER TABLE "source_ideas" ADD CONSTRAINT "source_ideas_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "book_video_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
