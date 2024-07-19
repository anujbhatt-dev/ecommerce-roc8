
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/header";
import { UserProvider, useUserContext } from "~/context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Roc8 careers ecommerce",
  description: "Roc8 careers ecommerce",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster
        position="top-right"
        reverseOrder={false}
        />
        <UserProvider>
          <TRPCReactProvider>
            <>

              <Header/>
              {children}
            </>
          </TRPCReactProvider>
        </UserProvider>
      </body>
    </html>
  );
}
