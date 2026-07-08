import { prisma } from "@/lib/prisma";
import { formatNumber, STATUS_LABEL } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import { MonthlyBarChart, StatusPieChart, TrendLineChart } from "@/components/DashboardCharts";

function IconSchool() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M5 10.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-5.5" />
    </svg>
  );
}
function IconTruck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="1.5" y="7" width="12" height="9" rx="1" />
      <path d="M13.5 10h4l3 3v3h-7v-6z" />
      <circle cx="6" cy="18" r="1.7" />
      <circle cx="16.5" cy="18" r="1.7" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.5" />
      <path d="M15 14.3c2.8.3 5 2.5 5 5.7" />
    </svg>
  );
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const [totalSekolah, totalVendor, totalMenu, totalSiswaAgg, distribusiBulanIni, allDistribusiForCharts] =
    await Promise.all([
      prisma.sekolah.count(),
      prisma.vendor.count(),
      prisma.menu.count(),
      prisma.sekolah.aggregate({ _sum: { jumlahSiswa: true } }),
      prisma.distribusi.findMany({
        where: { tanggal: { gte: startOfMonth } },
      }),
      prisma.distribusi.findMany({
        where: { tanggal: { gte: sixMonthsAgo } },
        select: { tanggal: true, jumlahPorsi: true, status: true },
      }),
  ]);

  const totalPorsiBulanIni = distribusiBulanIni.reduce(
    (s: number, d: { jumlahPorsi: number }) => s + d.jumlahPorsi,
    0
  );

  // Monthly aggregation (last 6 months)
  const monthlyMap = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthlyMap.set(key, 0);
  }
  for (const d of allDistribusiForCharts) {
    const dt = new Date(d.tanggal);
    const key = `${dt.getFullYear()}-${dt.getMonth()}`;
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + d.jumlahPorsi);
    }
  }
  const monthlyData = Array.from(monthlyMap.entries()).map(([key, porsi]) => {
    const [, month] = key.split("-").map(Number);
    return { bulan: MONTH_NAMES[month], porsi };
  });

  // Status breakdown (all time, using recent set is fine for demo — use full count)
  const statusCounts = await prisma.distribusi.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const statusData = statusCounts.map((s: { status: string; _count: { status: number } }) => ({
    name: STATUS_LABEL[s.status],
    value: s._count.status,
  }));

  // Trend last 14 days
  const trendMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
    trendMap.set(key, 0);
  }
  const recentDistribusi = await prisma.distribusi.findMany({
    where: { tanggal: { gte: fourteenDaysAgo } },
    select: { tanggal: true },
  });
  for (const d of recentDistribusi) {
    const key = new Date(d.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) || 0) + 1);
  }
  const trendData = Array.from(trendMap.entries()).map(([tanggal, jumlah]) => ({ tanggal, jumlah }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sekolah" value={formatNumber(totalSekolah)} icon={<IconSchool />} accent="bg-brand-50 text-brand-600" />
        <StatCard label="Total Vendor" value={formatNumber(totalVendor)} icon={<IconTruck />} accent="bg-blue-50 text-blue-600" />
        <StatCard label="Total Menu" value={formatNumber(totalMenu)} icon={<IconBox />} accent="bg-amber-50 text-amber-600" />
        <StatCard
          label="Total Siswa Terdaftar"
          value={formatNumber(totalSiswaAgg._sum.jumlahSiswa || 0)}
          icon={<IconUsers />}
          accent="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-xs text-slate-400">Distribusi Bulan Ini</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{formatNumber(distribusiBulanIni.length)} kegiatan</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-slate-400">Total Porsi Disalurkan Bulan Ini</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{formatNumber(totalPorsiBulanIni)} porsi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-1">Total Porsi per Bulan</h3>
          <p className="text-xs text-slate-400 mb-2">6 bulan terakhir</p>
          <MonthlyBarChart data={monthlyData} />
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-1">Status Distribusi</h3>
          <p className="text-xs text-slate-400 mb-2">Seluruh waktu</p>
          <StatusPieChart data={statusData} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-1">Tren Jumlah Distribusi Harian</h3>
        <p className="text-xs text-slate-400 mb-2">14 hari terakhir</p>
        <TrendLineChart data={trendData} />
      </div>
    </div>
  );
}
