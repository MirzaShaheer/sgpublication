-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('modal', 'exit', 'inline', 'contact');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'won', 'lost');

-- CreateEnum
CREATE TYPE "AuthorStage" AS ENUM ('idea', 'writing', 'manuscript_finished', 'published_not_selling', 'unknown');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "stage" "AuthorStage" NOT NULL DEFAULT 'unknown',
    "genre" TEXT,
    "wordCount" INTEGER,
    "budget" TEXT,
    "message" TEXT,
    "source" "LeadSource" NOT NULL,
    "path" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "notifiedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

