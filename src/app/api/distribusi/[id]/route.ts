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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Data tidak valid" }, { status: 400 });
  }

  const updated = await prisma.distribusi.update({
    where: { id: params.id },
    data: parsed.data,
    include: { sekolah: true, vendor: true, menu: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.distribusi.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
