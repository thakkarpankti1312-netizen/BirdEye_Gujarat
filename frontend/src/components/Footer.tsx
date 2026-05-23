// Footer with logo, links, contact and socials
import { FiGithub, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="about" className="mt-12 border-t border-border bg-gradient-to-b from-transparent to-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            AI-powered detection system dedicated to Gujarat's rich avian biodiversity.
            Helping enthusiasts, researchers and conservationists protect our skies.
          </p>
          <div className="mt-5 flex gap-3">
            {[FiTwitter, FiInstagram, FiGithub, FiMail].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full glass hover:gradient-primary hover:text-primary-foreground transition-all">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {["Home", "Features", "Upload", "About"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-primary transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@gujaratbird.ai</li>
            <li>Ahmedabad, Gujarat</li>
            <li>+91 99999 99999</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Gujarat Bird AI. Crafted with care for nature.
      </div>
    </footer>
  );
}
