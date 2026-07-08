export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sekolah/:path*",
    "/vendor/:path*",
    "/menu/:path*",
    "/distribusi/:path*",
    "/riwayat/:path*",
    "/search/:path*",
    "/api/sekolah/:path*",
    "/api/vendor/:path*",
    "/api/menu/:path*",
    "/api/distribusi/:path*",
    "/api/dashboard/:path*",
    "/api/search/:path*",
  ],
};
