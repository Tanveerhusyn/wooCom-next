import Providers from "@/components/layout/providers";

import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Shadcn",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers session={session}>
          <Toaster />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
