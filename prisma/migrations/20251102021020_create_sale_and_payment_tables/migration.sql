-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED', 'CONFIRMED', 'CANCELED');

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "buyerCpf" TEXT NOT NULL,
    "priceSnapshot" DECIMAL(10,2) NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "paymentCode" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
    "providerPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentCode_key" ON "Payment"("paymentCode");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
