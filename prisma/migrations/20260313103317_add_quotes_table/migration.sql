-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "mentor_id" UUID NOT NULL,
    "quote" TEXT NOT NULL,
    "place" TEXT,
    "photo_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
