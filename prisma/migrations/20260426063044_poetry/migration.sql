-- CreateTable
CREATE TABLE "Poetry" (
    "id" TEXT NOT NULL,
    "poetry" TEXT NOT NULL,

    CONSTRAINT "Poetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Poetry_id_idx" ON "Poetry"("id");
