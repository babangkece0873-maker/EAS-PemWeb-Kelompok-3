import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  tanggal: z.coerce.date(),
  sekolahId: z.string().min(1, "Sekolah wajib dipilih"),
  vendorId: z.string().min(1, "Vendor wajib dipilih"),
  menuId: z.string().min(1, "Menu wajib dipilih"),
  jumlahPorsi: z.coerce.number().int().nonnegative(),
  status: z.enum(["TERJADWAL", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"]),
  catatan: z.string().optional().default(""),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const q = sp.get("q") || "";
  const status = sp.get("status") || "";
  const sekolahId = sp.get("sekolahId") || "";
  const vendorId = sp.get("vendorId") || "";
  const from = sp.get("from");
  const to = sp.get("to");

  const where: any = { AND: [] as any[] };

  if (status) where.AND.push({ status });
  if (sekolahId) where.AND.push({ sekolahId });
  if (vendorId) where.AND.push({ vendorId });
  if (from) where.AND.push({ tanggal: { gte: new Date(from) } });
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    where.AND.push({ tanggal: { lte: end } });
  }
  if (q) {
    where.AND.push({
      OR: [
        { sekolah: { nama: { contains: q } } },
        { vendor: { nama: { contains: q } } },
        { menu: { nama: { contains: q } } },
        { catatan: { contains: q } },
      ],
    });
  }

  const data = await prisma.distribusi.findMany({
    where: where.AND.length ? where : undefined,
    include: { sekolah: true, vendor: true, menu: true },
    orderBy: { tanggal: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Data tidak valid" }, { status: 400 });
  }

  const created = await prisma.distribusi.create({
    data: parsed.data,
    include: { sekolah: true, vendor: true, menu: true },
  });
  return NextResponse.json(created, { status: 201 });
}
