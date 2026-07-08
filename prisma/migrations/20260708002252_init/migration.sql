-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Sekolah" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jenjang" TEXT NOT NULL DEFAULT 'SD',
    "jumlahSiswa" INTEGER NOT NULL DEFAULT 0,
    "kontak" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "kalori" INTEGER NOT NULL DEFAULT 0,
    "harga" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Distribusi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal" DATETIME NOT NULL,
    "sekolahId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "jumlahPorsi" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'TERJADWAL',
    "catatan" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Distribusi_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "Sekolah" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Distribusi_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Distribusi_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Sekolah_npsn_key" ON "Sekolah"("npsn");

-- CreateIndex
CREATE INDEX "Distribusi_tanggal_idx" ON "Distribusi"("tanggal");

-- CreateIndex
CREATE INDEX "Distribusi_status_idx" ON "Distribusi"("status");
