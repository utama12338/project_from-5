-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('DRAFT', 'PIBLISH');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasicInfo" (
    "id" SERIAL NOT NULL,
    "systemName" TEXT NOT NULL,
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BasicInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentInfo" (
    "id" SERIAL NOT NULL,
    "developType" TEXT NOT NULL,
    "developUnit" TEXT NOT NULL,
    "vendorContactNo" TEXT NOT NULL,
    "contractNo" TEXT NOT NULL,
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInfo" (
    "id" SERIAL NOT NULL,
    "businessUnit" TEXT NOT NULL,
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusInfo" (
    "id" SERIAL NOT NULL,
    "draftStatus" "DraftStatus" NOT NULL DEFAULT 'DRAFT',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentInfo" (
    "id" SERIAL NOT NULL,
    "environment" TEXT NOT NULL,
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvironmentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerConfig" (
    "id" SERIAL NOT NULL,
    "serverName" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "serverType" TEXT NOT NULL,
    "serverRole" TEXT NOT NULL,
    "serverDuty" TEXT NOT NULL,
    "database" TEXT NOT NULL,
    "application" TEXT NOT NULL,
    "environmentInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerSpec" (
    "id" SERIAL NOT NULL,
    "operatingSystem" TEXT NOT NULL,
    "servicePack" TEXT NOT NULL,
    "build" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "disk" TEXT NOT NULL,
    "dr" TEXT NOT NULL,
    "environmentInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerOps" (
    "id" SERIAL NOT NULL,
    "joinDomain" TEXT NOT NULL,
    "windowsCluster" TEXT NOT NULL,
    "productionUnit" TEXT NOT NULL,
    "environmentInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerOps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectionInfo" (
    "id" SERIAL NOT NULL,
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthConfig" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "adfs" TEXT NOT NULL,
    "connectionInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkConfig" (
    "id" SERIAL NOT NULL,
    "dns" TEXT NOT NULL,
    "ntp" TEXT NOT NULL,
    "snmp" TEXT NOT NULL,
    "netka" TEXT NOT NULL,
    "connectionInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityTools" (
    "id" SERIAL NOT NULL,
    "tpam" TEXT NOT NULL,
    "fim" TEXT NOT NULL,
    "connectionInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityTools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileTransfer" (
    "id" SERIAL NOT NULL,
    "ftpServer" TEXT NOT NULL,
    "ftpGoAnywhereMFTServer" TEXT NOT NULL,
    "connectionInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Communication" (
    "id" SERIAL NOT NULL,
    "emailSmtp" TEXT NOT NULL,
    "sms" TEXT NOT NULL,
    "connectionInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiConfig" (
    "id" SERIAL NOT NULL,
    "apiManagement" TEXT NOT NULL,
    "dv" TEXT NOT NULL,
    "connectionInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityInfo" (
    "id" SERIAL NOT NULL,
    "systemInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteConfig" (
    "id" SERIAL NOT NULL,
    "urlWebsite" TEXT NOT NULL,
    "certificateExpireDate" TEXT NOT NULL,
    "securityInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupConfig" (
    "id" SERIAL NOT NULL,
    "backupPolicy" TEXT NOT NULL,
    "securityInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceConfig" (
    "id" SERIAL NOT NULL,
    "downtimeAllowed" TEXT NOT NULL,
    "setupAgentPatch" TEXT NOT NULL,
    "centralizeLog" TEXT NOT NULL,
    "securityInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessConfig" (
    "id" SERIAL NOT NULL,
    "internetFacing" TEXT NOT NULL,
    "securityInfoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BasicInfo_systemInfoId_key" ON "BasicInfo"("systemInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentInfo_systemInfoId_key" ON "DevelopmentInfo"("systemInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInfo_systemInfoId_key" ON "BusinessInfo"("systemInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "StatusInfo_systemInfoId_key" ON "StatusInfo"("systemInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerConfig_environmentInfoId_key" ON "ServerConfig"("environmentInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerSpec_environmentInfoId_key" ON "ServerSpec"("environmentInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerOps_environmentInfoId_key" ON "ServerOps"("environmentInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthConfig_connectionInfoId_key" ON "AuthConfig"("connectionInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkConfig_connectionInfoId_key" ON "NetworkConfig"("connectionInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityTools_connectionInfoId_key" ON "SecurityTools"("connectionInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "FileTransfer_connectionInfoId_key" ON "FileTransfer"("connectionInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "Communication_connectionInfoId_key" ON "Communication"("connectionInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiConfig_connectionInfoId_key" ON "ApiConfig"("connectionInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteConfig_securityInfoId_key" ON "WebsiteConfig"("securityInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "BackupConfig_securityInfoId_key" ON "BackupConfig"("securityInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceConfig_securityInfoId_key" ON "MaintenanceConfig"("securityInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessConfig_securityInfoId_key" ON "AccessConfig"("securityInfoId");

-- AddForeignKey
ALTER TABLE "SystemInfo" ADD CONSTRAINT "SystemInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasicInfo" ADD CONSTRAINT "BasicInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentInfo" ADD CONSTRAINT "DevelopmentInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessInfo" ADD CONSTRAINT "BusinessInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusInfo" ADD CONSTRAINT "StatusInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentInfo" ADD CONSTRAINT "EnvironmentInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerConfig" ADD CONSTRAINT "ServerConfig_environmentInfoId_fkey" FOREIGN KEY ("environmentInfoId") REFERENCES "EnvironmentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerSpec" ADD CONSTRAINT "ServerSpec_environmentInfoId_fkey" FOREIGN KEY ("environmentInfoId") REFERENCES "EnvironmentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerOps" ADD CONSTRAINT "ServerOps_environmentInfoId_fkey" FOREIGN KEY ("environmentInfoId") REFERENCES "EnvironmentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectionInfo" ADD CONSTRAINT "ConnectionInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthConfig" ADD CONSTRAINT "AuthConfig_connectionInfoId_fkey" FOREIGN KEY ("connectionInfoId") REFERENCES "ConnectionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkConfig" ADD CONSTRAINT "NetworkConfig_connectionInfoId_fkey" FOREIGN KEY ("connectionInfoId") REFERENCES "ConnectionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityTools" ADD CONSTRAINT "SecurityTools_connectionInfoId_fkey" FOREIGN KEY ("connectionInfoId") REFERENCES "ConnectionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileTransfer" ADD CONSTRAINT "FileTransfer_connectionInfoId_fkey" FOREIGN KEY ("connectionInfoId") REFERENCES "ConnectionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Communication" ADD CONSTRAINT "Communication_connectionInfoId_fkey" FOREIGN KEY ("connectionInfoId") REFERENCES "ConnectionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiConfig" ADD CONSTRAINT "ApiConfig_connectionInfoId_fkey" FOREIGN KEY ("connectionInfoId") REFERENCES "ConnectionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityInfo" ADD CONSTRAINT "SecurityInfo_systemInfoId_fkey" FOREIGN KEY ("systemInfoId") REFERENCES "SystemInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteConfig" ADD CONSTRAINT "WebsiteConfig_securityInfoId_fkey" FOREIGN KEY ("securityInfoId") REFERENCES "SecurityInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackupConfig" ADD CONSTRAINT "BackupConfig_securityInfoId_fkey" FOREIGN KEY ("securityInfoId") REFERENCES "SecurityInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceConfig" ADD CONSTRAINT "MaintenanceConfig_securityInfoId_fkey" FOREIGN KEY ("securityInfoId") REFERENCES "SecurityInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessConfig" ADD CONSTRAINT "AccessConfig_securityInfoId_fkey" FOREIGN KEY ("securityInfoId") REFERENCES "SecurityInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
