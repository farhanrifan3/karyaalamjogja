import type { Metadata } from "next";

import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "CMS Karya Alam",
    template: "%s · CMS Karya Alam",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin">{children}</div>;
}
