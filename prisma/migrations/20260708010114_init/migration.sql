-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sekolah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jenjang" TEXT NOT NULL DEFAULT 'SD',
    "jumlahSiswa" INTEGER NOT NULL DEFAULT 0,
    "kontak" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sekolah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kontak" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "kalori" INTEGER NOT NULL DEFAULT 0,
    "harga" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribusi" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "sekolahId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "jumlahPorsi" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'TERJADWAL',
    "catatan" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distribusi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Sekolah_npsn_key" ON "Sekolah"("npsn");

-- CreateIndex
CREATE INDEX "Distribusi_tanggal_idx" ON "Distribusi"("tanggal");

-- CreateIndex
CREATE INDEX "Distribusi_status_idx" ON "Distribusi"("status");

-- AddForeignKey
ALTER TABLE "Distribusi" ADD CONSTRAINT "Distribusi_sekolahId_fkey" FOREIGN KEY ("sekolahId") REFERENCES "Sekolah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribusi" ADD CONSTRAINT "Distribusi_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribusi" ADD CONSTRAINT "Distribusi_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
