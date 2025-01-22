"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/Header.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      
        <header className="header">
          <div className="logo">
            <img src="/TTL_group-lockup_White.png" alt="Company Logo" className="logoImage"></img>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
