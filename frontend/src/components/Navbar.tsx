// Sticky white navbar with rounded corners and soft shadow
import { useNavigate } from "@tanstack/react-router";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Upload", href: "#upload" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // Dummy logout — clears local flag and returns to login page
    localStorage.removeItem("gba_loggedIn");
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-3 z-40 px-3">
      <nav className="mx-auto max-w-7xl glass rounded-2xl shadow-soft">
        <div className="flex items-center justify-between px-5 py-3">
          <Logo />

          {/* Center links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              title="User Profile"
              aria-label="User Profile"
              className="grid h-10 w-10 place-items-center rounded-full bg-secondary hover:bg-accent transition-colors">
              <FiUser className="text-foreground" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden grid h-10 w-10 place-items-center rounded-full bg-secondary" onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border px-5 py-4 space-y-3">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium">
                {l.label}
              </a>
            ))}
            <button onClick={handleLogout} className="w-full rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
