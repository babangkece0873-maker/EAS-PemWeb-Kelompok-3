import { PrismaClient, StatusDistribusi } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashed,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  const opHashed = await bcrypt.hash("operator123", 10);
  await prisma.user.upsert({
    where: { username: "operator" },
    update: {},
    create: {
      username: "operator",
      password: opHashed,
      name: "Operator Lapangan",
      role: "OPERATOR",
    },
  });

  const sekolahData = [
    { nama: "SDN 01 Menteng", npsn: "20100001", alamat: "Jl. Cikini Raya No.1, Jakarta Pusat", jenjang: "SD", jumlahSiswa: 320, kontak: "021-1234001" },
    { nama: "SDN 02 Cempaka Putih", npsn: "20100002", alamat: "Jl. Cempaka Putih No.5, Jakarta Pusat", jenjang: "SD", jumlahSiswa: 280, kontak: "021-1234002" },
    { nama: "SMPN 03 Kebayoran", npsn: "20100003", alamat: "Jl. Kebayoran Baru No.10, Jakarta Selatan", jenjang: "SMP", jumlahSiswa: 410, kontak: "021-1234003" },
    { nama: "SMPN 07 Tebet", npsn: "20100004", alamat: "Jl. Tebet Barat No.22, Jakarta Selatan", jenjang: "SMP", jumlahSiswa: 375, kontak: "021-1234004" },
    { nama: "SMAN 05 Senayan", npsn: "20100005", alamat: "Jl. Asia Afrika No.8, Jakarta Pusat", jenjang: "SMA", jumlahSiswa: 500, kontak: "021-1234005" },
    { nama: "SDN 11 Pademangan", npsn: "20100006", alamat: "Jl. Pademangan Timur No.3, Jakarta Utara", jenjang: "SD", jumlahSiswa: 260, kontak: "021-1234006" },
  ];
  const sekolahs = [];
  for (const s of sekolahData) {
    const rec = await prisma.sekolah.upsert({ where: { npsn: s.npsn }, update: {}, create: s });
    sekolahs.push(rec);
  }

  const vendorData = [
    { nama: "CV Dapur Sehat Nusantara", alamat: "Jl. Industri No.12, Jakarta Timur", kontak: "021-5551001", email: "info@dapursehat.co.id" },
    { nama: "PT Katering Bergizi Indonesia", alamat: "Jl. Raya Bekasi No.45, Jakarta Timur", kontak: "021-5551002", email: "cs@kateringbergizi.co.id" },
    { nama: "Yayasan Dapur Ceria", alamat: "Jl. Kalimalang No.8, Bekasi", kontak: "021-5551003", email: "halo@dapurceria.org" },
  ];
  const vendors = [];
  for (const v of vendorData) {
    const rec = await prisma.vendor.create({ data: v });
    vendors.push(rec);
  }

  const menuData = [
    { nama: "Nasi Ayam Sayur Bayam", deskripsi: "Nasi putih, ayam suwir, tumis bayam, tempe", kalori: 650, harga: 12000 },
    { nama: "Nasi Ikan Balado Sayur", deskripsi: "Nasi putih, ikan balado, tumis kacang panjang", kalori: 600, harga: 11500 },
    { nama: "Nasi Telur Dadar Sayur Sop", deskripsi: "Nasi putih, telur dadar, sayur sop, buah pisang", kalori: 580, harga: 10500 },
    { nama: "Nasi Rendang Sayur Toge", deskripsi: "Nasi putih, rendang daging, tumis toge, jeruk", kalori: 700, harga: 13500 },
  ];
  const menus = [];
  for (const m of menuData) {
    const rec = await prisma.menu.create({ data: m });
    menus.push(rec);
  }

  const statuses: StatusDistribusi[] = ["SELESAI", "SELESAI", "SELESAI", "DIKIRIM", "DIPROSES", "TERJADWAL", "DIBATALKAN"];
  const today = new Date();
  const distribusiRows = [];
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(Math.random() * 60) - 5;
    const tanggal = new Date(today);
    tanggal.setDate(today.getDate() - daysAgo);
    const sekolah = sekolahs[Math.floor(Math.random() * sekolahs.length)];
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const menu = menus[Math.floor(Math.random() * menus.length)];
    const status = daysAgo < 0 ? "TERJADWAL" : statuses[Math.floor(Math.random() * statuses.length)];
    distribusiRows.push({
      tanggal,
      sekolahId: sekolah.id,
      vendorId: vendor.id,
      menuId: menu.id,
      jumlahPorsi: sekolah.jumlahSiswa,
      status,
      catatan: "",
    });
  }
  await prisma.distribusi.createMany({ data: distribusiRows as any });

  console.log("Seeding selesai.");
  console.log("Login: admin / admin123  atau  operator / operator123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
