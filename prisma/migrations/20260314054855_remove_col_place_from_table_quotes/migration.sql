/*
  Warnings:

  - You are about to drop the column `place` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "quotes" DROP COLUMN "place";

-- DropTable
DROP TABLE "tokens";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "login_type";

-- DropEnum
DROP TYPE "love_language";

-- DropEnum
DROP TYPE "mbti";

-- DropEnum
DROP TYPE "relationship_type";

-- DropEnum
DROP TYPE "role_type";

-- DropEnum
DROP TYPE "zodiac_sign";
