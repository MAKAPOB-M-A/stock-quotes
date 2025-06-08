-- CreateTable
CREATE TABLE "Symbol" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Symbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "symbol_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "datetime" INTEGER NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_symbol_key" ON "Symbol"("symbol");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_symbol_id_fkey" FOREIGN KEY ("symbol_id") REFERENCES "Symbol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
