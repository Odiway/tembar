-- CreateTable
CREATE TABLE "stock_items" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectNumber" TEXT NOT NULL,
    "deliveryTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,

    CONSTRAINT "stock_items_pkey" PRIMARY KEY ("id")
);