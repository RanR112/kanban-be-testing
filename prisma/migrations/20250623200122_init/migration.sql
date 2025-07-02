-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'MANAGER', 'SUPERVISOR', 'LEADER', 'STAFF');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED_BY_DEPARTMENT', 'PENDING_PC', 'APPROVED_BY_PC', 'REJECTED_BY_DEPARTMENT', 'REJECTED_BY_PC');

-- CreateEnum
CREATE TYPE "ApprovalRole" AS ENUM ('LEADER', 'SUPERVISOR', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REFRESH_TOKEN', 'ACCESS_TOKEN', 'PASSWORD_RESET', 'EMAIL_VERIFICATION');

-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFICATION', 'TWO_FACTOR_AUTH');

-- CreateTable
CREATE TABLE "users" (
    "id_users" SERIAL NOT NULL,
    "id_department" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "email" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_users")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OtpType" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departemen" (
    "id_department" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "departemen_pkey" PRIMARY KEY ("id_department")
);

-- CreateTable
CREATE TABLE "request_kanban" (
    "id_kanban" SERIAL NOT NULL,
    "id_users" INTEGER NOT NULL,
    "id_department" INTEGER NOT NULL,
    "tgl_produksi" TIMESTAMP(3) NOT NULL,
    "nama_requester" TEXT NOT NULL,
    "parts_number" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "box" TEXT NOT NULL,
    "klasifikasi" TEXT NOT NULL,
    "keterangan" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_kanban_pkey" PRIMARY KEY ("id_kanban")
);

-- CreateTable
CREATE TABLE "persetujuan" (
    "id_users" INTEGER NOT NULL,
    "id_department" INTEGER NOT NULL,
    "id_kanban" INTEGER NOT NULL,
    "role" "ApprovalRole" NOT NULL,
    "approve" BOOLEAN NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persetujuan_pkey" PRIMARY KEY ("id_users","id_department","id_kanban","role")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "table_name" TEXT,
    "record_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE INDEX "tokens_user_id_idx" ON "tokens"("user_id");

-- CreateIndex
CREATE INDEX "tokens_token_idx" ON "tokens"("token");

-- CreateIndex
CREATE INDEX "tokens_expires_at_idx" ON "tokens"("expires_at");

-- CreateIndex
CREATE INDEX "otp_codes_user_id_idx" ON "otp_codes"("user_id");

-- CreateIndex
CREATE INDEX "otp_codes_code_idx" ON "otp_codes"("code");

-- CreateIndex
CREATE INDEX "otp_codes_expires_at_idx" ON "otp_codes"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_department_fkey" FOREIGN KEY ("id_department") REFERENCES "departemen"("id_department") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_users") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id_users") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_kanban" ADD CONSTRAINT "request_kanban_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "users"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_kanban" ADD CONSTRAINT "request_kanban_id_department_fkey" FOREIGN KEY ("id_department") REFERENCES "departemen"("id_department") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persetujuan" ADD CONSTRAINT "persetujuan_id_users_fkey" FOREIGN KEY ("id_users") REFERENCES "users"("id_users") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persetujuan" ADD CONSTRAINT "persetujuan_id_department_fkey" FOREIGN KEY ("id_department") REFERENCES "departemen"("id_department") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persetujuan" ADD CONSTRAINT "persetujuan_id_kanban_fkey" FOREIGN KEY ("id_kanban") REFERENCES "request_kanban"("id_kanban") ON DELETE RESTRICT ON UPDATE CASCADE;
