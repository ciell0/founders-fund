// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "FoundersFund — Financial Literacy & AI Projections for Student Startups",
  description: "Platform proyeksi keuangan berbasis AI dan pelacak burn rate/runway dana hibah untuk tim startup mahasiswa. Dibuat khusus untuk 10th IndonesiaNEXT Hackathon.",
  keywords: ["IndonesiaNEXT", "Hackathon", "Startup Mahasiswa", "Financial Literacy", "Runway Tracker", "AI Pitch Deck Projection"],
  authors: [{ name: "FoundersFund Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${jakarta.variable} font-sans antialiased text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
