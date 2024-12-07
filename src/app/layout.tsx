import { Toaster } from "sonner";
import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Modals } from "@/components/modals";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import localFont from "next/font/local";
import { JotaiProvider } from "@/components/jotai-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Collab.io",
  description: "A Place to Collab and Connect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
