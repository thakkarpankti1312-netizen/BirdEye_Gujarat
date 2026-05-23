// Main landing page — composes all sections
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import WarningBar from "@/components/WarningBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Upload from "@/components/Upload";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();

  // Simple client-side auth gate — redirect to login if not signed in
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("gba_loggedIn")) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <WarningBar />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Upload />
      </main>
      <Footer />
    </div>
  );
}
