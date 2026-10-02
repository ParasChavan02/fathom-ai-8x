import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Relay · Meeting intelligence", description: "Turn every conversation into momentum." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
