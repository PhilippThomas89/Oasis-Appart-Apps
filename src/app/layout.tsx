import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biologielabor Dashboard | EFG Schwarzheide",
  description:
    "Projektdashboard für die Modernisierung des Biologielabors am Emil-Fischer-Gymnasium Schwarzheide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
