/*
  Warnings:

  - You are about to drop the `AccessConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApiConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BackupConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BasicInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Communication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DevelopmentInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileTransfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaintenanceConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetworkConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecurityTools` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerOps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerSpec` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StatusInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebsiteConfig` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ad` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adfs` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiManagement` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dns` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dv` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailSmtp` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fim` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ftpGoAnywhereMFTServer` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ftpServer` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netka` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ntp` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sms` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snmp` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tpam` to the `ConnectionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `application` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `build` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpu` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `database` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disk` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dr` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinDomain` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatingSystem` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productionUnit` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverDuty` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverName` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverRole` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverType` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePack` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windowsCluster` to the `EnvironmentInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backupPolicy` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centralizeLog` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `certificateExpireDate` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downtimeAllowed` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `internetFacing` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setupAgentPatch` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlWebsite` to the `SecurityInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessUnit` to the `SystemInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractNo` to the `SystemInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developType` to the `SystemInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developUnit` to the `SystemInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemName` to the `SystemInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vendorContactNo` to the `SystemInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccessConfig" DROP CONSTRAINT "AccessConfig_securityInfoId_fkey";

-- DropForeignKey
ALTER TABLE "ApiConfig" DROP CONSTRAINT "ApiConfig_connectionInfoId_fkey";

-- DropForeignKey
ALTER TABLE "AuthConfig" DROP CONSTRAINT "AuthConfig_connectionInfoId_fkey";

-- DropForeignKey
ALTER TABLE "BackupConfig" DROP CONSTRAINT "BackupConfig_securityInfoId_fkey";

-- DropForeignKey
ALTER TABLE "BasicInfo" DROP CONSTRAINT "BasicInfo_systemInfoId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessInfo" DROP CONSTRAINT "BusinessInfo_systemInfoId_fkey";

-- DropForeignKey
ALTER TABLE "Communication" DROP CONSTRAINT "Communication_connectionInfoId_fkey";

-- DropForeignKey
ALTER TABLE "DevelopmentInfo" DROP CONSTRAINT "DevelopmentInfo_systemInfoId_fkey";

-- DropForeignKey
ALTER TABLE "FileTransfer" DROP CONSTRAINT "FileTransfer_connectionInfoId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceConfig" DROP CONSTRAINT "MaintenanceConfig_securityInfoId_fkey";

-- DropForeignKey
ALTER TABLE "NetworkConfig" DROP CONSTRAINT "NetworkConfig_connectionInfoId_fkey";

-- DropForeignKey
ALTER TABLE "SecurityTools" DROP CONSTRAINT "SecurityTools_connectionInfoId_fkey";

-- DropForeignKey
ALTER TABLE "ServerConfig" DROP CONSTRAINT "ServerConfig_environmentInfoId_fkey";

-- DropForeignKey
ALTER TABLE "ServerOps" DROP CONSTRAINT "ServerOps_environmentInfoId_fkey";

-- DropForeignKey
ALTER TABLE "ServerSpec" DROP CONSTRAINT "ServerSpec_environmentInfoId_fkey";

-- DropForeignKey
ALTER TABLE "StatusInfo" DROP CONSTRAINT "StatusInfo_systemInfoId_fkey";

-- DropForeignKey
ALTER TABLE "SystemInfo" DROP CONSTRAINT "SystemInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "WebsiteConfig" DROP CONSTRAINT "WebsiteConfig_securityInfoId_fkey";

-- AlterTable
ALTER TABLE "ConnectionInfo" ADD COLUMN     "ad" TEXT NOT NULL,
ADD COLUMN     "adfs" TEXT NOT NULL,
ADD COLUMN     "apiManagement" TEXT NOT NULL,
ADD COLUMN     "dns" TEXT NOT NULL,
ADD COLUMN     "dv" TEXT NOT NULL,
ADD COLUMN     "emailSmtp" TEXT NOT NULL,
ADD COLUMN     "fim" TEXT NOT NULL,
ADD COLUMN     "ftpGoAnywhereMFTServer" TEXT NOT NULL,
ADD COLUMN     "ftpServer" TEXT NOT NULL,
ADD COLUMN     "netka" TEXT NOT NULL,
ADD COLUMN     "ntp" TEXT NOT NULL,
ADD COLUMN     "sms" TEXT NOT NULL,
ADD COLUMN     "snmp" TEXT NOT NULL,
ADD COLUMN     "tpam" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EnvironmentInfo" ADD COLUMN     "application" TEXT NOT NULL,
ADD COLUMN     "build" TEXT NOT NULL,
ADD COLUMN     "cpu" TEXT NOT NULL,
ADD COLUMN     "database" TEXT NOT NULL,
ADD COLUMN     "disk" TEXT NOT NULL,
ADD COLUMN     "dr" TEXT NOT NULL,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "joinDomain" TEXT NOT NULL,
ADD COLUMN     "operatingSystem" TEXT NOT NULL,
ADD COLUMN     "productionUnit" TEXT NOT NULL,
ADD COLUMN     "ram" TEXT NOT NULL,
ADD COLUMN     "serverDuty" TEXT NOT NULL,
ADD COLUMN     "serverName" TEXT NOT NULL,
ADD COLUMN     "serverRole" TEXT NOT NULL,
ADD COLUMN     "serverType" TEXT NOT NULL,
ADD COLUMN     "servicePack" TEXT NOT NULL,
ADD COLUMN     "windowsCluster" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SecurityInfo" ADD COLUMN     "backupPolicy" TEXT NOT NULL,
ADD COLUMN     "centralizeLog" TEXT NOT NULL,
ADD COLUMN     "certificateExpireDate" TEXT NOT NULL,
ADD COLUMN     "downtimeAllowed" TEXT NOT NULL,
ADD COLUMN     "internetFacing" TEXT NOT NULL,
ADD COLUMN     "setupAgentPatch" TEXT NOT NULL,
ADD COLUMN     "urlWebsite" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemInfo" ADD COLUMN     "businessUnit" TEXT NOT NULL,
ADD COLUMN     "contractNo" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "developType" TEXT NOT NULL,
ADD COLUMN     "developUnit" TEXT NOT NULL,
ADD COLUMN     "draftStatus" "DraftStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "systemName" TEXT NOT NULL,
ADD COLUMN     "vendorContactNo" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "AccessConfig";

-- DropTable
DROP TABLE "ApiConfig";

-- DropTable
DROP TABLE "AuthConfig";

-- DropTable
DROP TABLE "BackupConfig";

-- DropTable
DROP TABLE "BasicInfo";

-- DropTable
DROP TABLE "BusinessInfo";

-- DropTable
DROP TABLE "Communication";

-- DropTable
DROP TABLE "DevelopmentInfo";

-- DropTable
DROP TABLE "FileTransfer";

-- DropTable
DROP TABLE "MaintenanceConfig";

-- DropTable
DROP TABLE "NetworkConfig";

-- DropTable
DROP TABLE "SecurityTools";

-- DropTable
DROP TABLE "ServerConfig";

-- DropTable
DROP TABLE "ServerOps";

-- DropTable
DROP TABLE "ServerSpec";

-- DropTable
DROP TABLE "StatusInfo";

-- DropTable
DROP TABLE "WebsiteConfig";

-- AddForeignKey
ALTER TABLE "SystemInfo" ADD CONSTRAINT "SystemInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
