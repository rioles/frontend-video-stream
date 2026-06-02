import type { Metadata } from "next";
import { KeycloakProvider } from "@/context/KeycloakContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Stream",
  description: "Video streaming app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <KeycloakProvider>
          {children}
        </KeycloakProvider>
      </body>
    </html>
  );
}
