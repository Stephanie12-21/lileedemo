-- CreateTable
CREATE TABLE "newsletter" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "unsubscribeToken" TEXT,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");
