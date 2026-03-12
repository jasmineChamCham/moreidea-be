/*
  Warnings:

  - You are about to drop the column `bg_vibe` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `camera_angle` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the `favourite_ideas` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "source_type" ADD VALUE 'podcast';
ALTER TYPE "source_type" ADD VALUE 'article';

-- AlterTable
ALTER TABLE "book_video_sources" ADD COLUMN     "mentor_id" UUID;

-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "bg_vibe",
DROP COLUMN "camera_angle",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "bodyLanguage" TEXT,
ADD COLUMN     "era" TEXT,
ADD COLUMN     "mindset" TEXT,
ADD COLUMN     "philosophy" TEXT,
ADD COLUMN     "speakingStyle" TEXT,
ALTER COLUMN "style" DROP NOT NULL;

-- AlterTable
ALTER TABLE "source_ideas" ADD COLUMN     "application" TEXT,
ADD COLUMN     "example" TEXT,
ADD COLUMN     "topic_id" UUID;

-- DropTable
DROP TABLE "favourite_ideas";

-- CreateTable
CREATE TABLE "topics" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
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
CREATE TABLE "mentor_quotes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "mentorId" UUID NOT NULL,
    "quote" TEXT NOT NULL,
    "meaning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");

-- AddForeignKey
ALTER TABLE "mentor_topics" ADD CONSTRAINT "mentor_topics_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_topics" ADD CONSTRAINT "mentor_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_video_sources" ADD CONSTRAINT "book_video_sources_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_ideas" ADD CONSTRAINT "source_ideas_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_quotes" ADD CONSTRAINT "mentor_quotes_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
