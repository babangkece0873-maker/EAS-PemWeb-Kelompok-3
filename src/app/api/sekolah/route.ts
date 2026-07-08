import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  npsn: z.string().min(1, "NPSN wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  jenjang: z.string().min(1),
  jumlahSiswa: z.coerce.number().int().nonnegative(),
  kontak: z.string().optional().default(""),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q") || "";
  const data = await prisma.sekolah.findMany({
    where: q
      ? {
          OR: [
            { nama: { contains: q } },
            { npsn: { contains: q } },
            { alamat: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { nama: "asc" },
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

  try {
    const created = await prisma.sekolah.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "NPSN sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}
