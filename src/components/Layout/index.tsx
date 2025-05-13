// src/components/Layout/index.tsx
import { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InstagramBanner } from "@/components/InstagramBanner";
import { EditableContent } from '../EditableContent'; // Import the EditableContent component

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main>
        {/* Wrap the children with EditableContent if needed */}
        <div>
          <EditableContent contentId="someContentId" path="somePath" />
          {children}
        </div>
      </main>
      <InstagramBanner />
      <Footer />
    </div>
  );
};