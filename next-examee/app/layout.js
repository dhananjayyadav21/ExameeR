import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContentState from "@/context/ContentState";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import GoToImpsButton from "@/components/GoToImpsButton";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense } from "react";
import GlobalLoader from "@/components/GlobalLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Examee - Your Ultimate Learning Partner",
  description: "Access premium Notes, Previous Year Papers, and expert Video Lectures. Elevate your academic performance with Examee.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleOAuthProvider clientId="81360539878-c23jclv7lc31cf8m2remiso4qk6kthd4.apps.googleusercontent.com">
          <ContentState>
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div className="p-3 text-center bg-white">Loading Navbar...</div>}>
                <Navbar />
              </Suspense>

              <main className="flex-grow">
                {children}
              </main>

              <Footer />
            </div>

            <GlobalLoader />
            <FloatingWhatsAppButton />
            <GoToImpsButton />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </ContentState>
        </GoogleOAuthProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}
