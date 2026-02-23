import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContentState from "@/context/ContentState";
import Navbar from "@/components/Navbar";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import GoToImpsButton from "@/components/GoToImpsButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Examee - Your Learning Partner",
  description: "Notes, Q-Papers, Video Lectures and Courses for Students",
};

import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleOAuthProvider clientId="81360539878-c23jclv7lc31cf8m2remiso4qk6kthd4.apps.googleusercontent.com">
          <ContentState>
            <Suspense fallback={<div className="p-3 text-center">Loading Navbar...</div>}>
              <Navbar />
            </Suspense>
            {children}
            <FloatingWhatsAppButton />
            <GoToImpsButton />
            <ToastContainer />
          </ContentState>
        </GoogleOAuthProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
