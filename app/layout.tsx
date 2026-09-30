import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WorkspaceDraftSync } from "../components/builder/WorkspaceDraftSync";
import "./globals.css";
import "./workspace.css";

export const metadata: Metadata = {
  title: "Worbee — Build your workspace",
  description:
    "Choose furniture for a workspace that fits your day. See your setup come together and send a rental enquiry.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WorkspaceDraftSync />
        {children}
      </body>
    </html>
  );
}
