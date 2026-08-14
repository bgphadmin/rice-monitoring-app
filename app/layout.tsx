
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast"
import LinksDropdown from "@/components/utils/LinksDropdown";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, } from '@clerk/nextjs';
import SyncUser from "@/components/utils/auth/SyncUser";
import verifyUser from "@/utils/userValidation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rice Inventory App",
  description: "Manage rice stock, distributions, and benefits",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSuperUser = await verifyUser("SUPERUSER");
  const isAdmin = await verifyUser("ADMIN");
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900">
          <header className="border-b bg-white shadow-sm">
            <nav className="container mx-auto flex flex-wrap items-center justify-between p-4">
              <Link href="/" className="text-xl font-bold text-slate-700">Rice Monitoring App</Link>
              <SignedIn>
                <div className="hidden md:flex space-x-4">
                  <Link href="/dashboard" className="hover:text-green-600">Dashboard</Link>
                  <Link href="/inventory" className={isAdmin || isSuperUser ? "hover:text-green-600" : "hidden"}>Inventory</Link>
                  <Link href="/distribution" className={isAdmin || isSuperUser ? "hover:text-green-600" : "hidden"}>Distribution</Link>
                  <Link href="/stockLog" className={isAdmin || isSuperUser ? "hover:text-green-600" : "hidden"}>Stock Logs</Link>
                  <Link href="/users" className={isSuperUser ? "hover:text-green-600" : "hidden"}>Users</Link>
                  <UserButton />
                </div>
                <div className="md:hidden" >
                  <LinksDropdown />
                </div>
              </SignedIn>
              <SignedOut>
                <div className="md:flex space-x-4">
                  <SignInButton mode="modal">Login</SignInButton>
                  <SignUpButton signInForceRedirectUrl="/" mode="modal">Register</SignUpButton>
                </div>
              </SignedOut>
            </nav>
          </header>
          <Toaster
            position="top-right"
            toastOptions={{
              // Default styles for all toasts
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
                padding: "12px 16px",
                fontSize: "14px",
              },
              success: {
                style: {
                  background: "#ecfdf5",
                  color: "#065f46",
                  border: "1px solid #6ee7b7",
                },
                icon: "✅",
              },
              error: {
                style: {
                  background: "#fef2f2",
                  color: "#b91c1c",
                  border: "1px solid #fca5a5",
                },
                icon: "❌",
              },
              loading: {
                style: {
                  background: "#eff6ff",
                  color: "#1e40af",
                  border: "1px solid #93c5fd",
                },
                icon: "⏳",
              },
            }}
          />
          <SyncUser />
          <main className="container mx-auto p-6">{children}</main>
          <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Rice Monitoring App
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}