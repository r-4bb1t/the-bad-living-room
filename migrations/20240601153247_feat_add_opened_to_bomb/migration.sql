/*
  Warnings:

  - Added the required column `opened` to the `Bomb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bomb" ADD COLUMN     "opened" BOOLEAN NOT NULL;
