/*
  Warnings:

  - The `text` column on the `Bomb` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Bomb" DROP COLUMN "text",
ADD COLUMN     "text" TEXT[];
