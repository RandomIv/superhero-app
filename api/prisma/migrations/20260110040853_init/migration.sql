-- CreateTable
CREATE TABLE "superheroes" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "real_name" TEXT NOT NULL,
    "origin_description" TEXT NOT NULL,
    "superpowers" TEXT[],
    "catch_phrase" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "superheroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "superhero_images" (
    "id" TEXT NOT NULL,
    "superhero_id" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "superhero_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_superhero_id" ON "superhero_images"("superhero_id");

-- AddForeignKey
ALTER TABLE "superhero_images" ADD CONSTRAINT "superhero_images_superhero_id_fkey" FOREIGN KEY ("superhero_id") REFERENCES "superheroes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
