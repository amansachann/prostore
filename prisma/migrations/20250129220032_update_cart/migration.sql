/*
  Warnings:

  - You are about to drop the column `item` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "item",
ADD COLUMN     "items" JSON[] DEFAULT ARRAY[]::JSON[];
