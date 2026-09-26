/*
  Warnings:

  - You are about to drop the column `contact` on the `SupplierOffer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SupplierOffer" DROP COLUMN "contact",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "telegram" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT;
