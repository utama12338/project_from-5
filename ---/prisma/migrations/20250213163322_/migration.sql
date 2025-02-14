-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERUSER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "viewHistory" BOOLEAN NOT NULL DEFAULT false,
    "canCreateuser" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemInfo" (
    "id" SERIAL NOT NULL,
    "systemName" VARCHAR(255),
    "developType" VARCHAR(50),
    "contractNo" VARCHAR(100),
    "vendorContactNo" VARCHAR(50),
    "businessUnit" VARCHAR(100),
    "developUnit" VARCHAR(100),
    "computerbackup" VARCHAR(50),
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentInfo" (
    "id" SERIAL NOT NULL,
    "environment" VARCHAR(50),
    "serverName" VARCHAR(255),
    "ip" VARCHAR(20),
    "serverType" VARCHAR(50),
    "serverRole" VARCHAR(100),
    "serverDuty" VARCHAR(100),
    "database" VARCHAR(100),
    "application" VARCHAR(100),
    "operatingSystem" VARCHAR(50),
    "servicePack" VARCHAR(50),
    "build" VARCHAR(50),
    "cpu" VARCHAR(30),
    "ram" VARCHAR(50),
    "disk" VARCHAR(50),
    "dr" VARCHAR(50),
    "joinDomain" VARCHAR(50),
    "windowsCluster" VARCHAR(50),
    "productionUnit" VARCHAR(50)[],
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvironmentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionInfo" (
    "id" SERIAL NOT NULL,
    "ad" VARCHAR(10),
    "adfs" VARCHAR(10),
    "dns" VARCHAR(10),
    "ntp" VARCHAR(10),
    "tpam" VARCHAR(10),
    "netka" VARCHAR(10),
    "fim" VARCHAR(10),
    "ftpServer" VARCHAR(10),
    "ftpGoAnywhereMFTServer" VARCHAR(10),
    "emailSmtp" VARCHAR(10),
    "sms" VARCHAR(10),
    "apiManagement" VARCHAR(10),
    "dv" VARCHAR(10),
    "snmp" VARCHAR(10),
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityInfo" (
    "id" SERIAL NOT NULL,
    "urlWebsite" VARCHAR(255),
    "certificateExpireDate" VARCHAR(100),
    "backupPolicy" VARCHAR(255),
    "downtimeAllowed" VARCHAR(255),
    "centralizeLog" VARCHAR(10),
    "setupAgentPatch" VARCHAR(10),
    "internetFacing" VARCHAR(10),
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServerTypeOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServerRoleOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServerDutyOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductionUnitOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DeveloperUnitOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "YesNoOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DrDcOption" (
    "option" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DeveloperTypeOption" (
    "option" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EnvironmentOption_option_key" ON "EnvironmentOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "ServerTypeOption_option_key" ON "ServerTypeOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "ServerRoleOption_option_key" ON "ServerRoleOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "ServerDutyOption_option_key" ON "ServerDutyOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionUnitOption_option_key" ON "ProductionUnitOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperUnitOption_option_key" ON "DeveloperUnitOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "YesNoOption_option_key" ON "YesNoOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "DrDcOption_option_key" ON "DrDcOption"("option");

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperTypeOption_option_key" ON "DeveloperTypeOption"("option");

-- AddForeignKey
ALTER TABLE "SystemInfo" ADD CONSTRAINT "SystemInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentInfo" ADD CONSTRAINT "EnvironmentInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionInfo" ADD CONSTRAINT "ConnectionInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityInfo" ADD CONSTRAINT "SecurityInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
