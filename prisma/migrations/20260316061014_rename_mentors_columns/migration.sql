/*
  Warnings:

  - You are about to drop the column `bodyLanguage` on the `mentors` table. All the data in the column will be lost.
  - You are about to drop the column `speakingStyle` on the `mentors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mentors" DROP COLUMN "bodyLanguage",
DROP COLUMN "speakingStyle",
ADD COLUMN     "body_language" TEXT,
ADD COLUMN     "speaking_style" TEXT;
