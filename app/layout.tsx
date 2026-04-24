import React from "react";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";
import { DM_Sans } from "next/font/google";


const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  // need weights or it doesnt load 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Providers> {/* Wrap app in Providers so session data is available globally */}
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}