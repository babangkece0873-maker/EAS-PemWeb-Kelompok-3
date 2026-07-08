import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) {
    return NextResponse.json({ sekolah: [], vendor: [], menu: [], distribusi: [] });
  }

  const [sekolah, vendor, menu, distribusi] = await Promise.all([
    prisma.sekolah.findMany({
      where: { OR: [{ nama: { contains: q } }, { npsn: { contains: q } }, { alamat: { contains: q } }] },
      take: 8,
    }),
    prisma.vendor.findMany({
      where: { OR: [{ nama: { contains: q } }, { alamat: { contains: q } }] },
      take: 8,
    }),
    prisma.menu.findMany({
      where: { OR: [{ nama: { contains: q } }, { deskripsi: { contains: q } }] },
      take: 8,
    }),
    prisma.distribusi.findMany({
      where: {
        OR: [
          { sekolah: { nama: { contains: q } } },
          { vendor: { nama: { contains: q } } },
          { menu: { nama: { contains: q } } },
        ],
      },
      include: { sekolah: true, vendor: true, menu: true },
      orderBy: { tanggal: "desc" },
      take: 8,
    }),
  ]);

  return NextResponse.json({ sekolah, vendor, menu, distribusi });
}
