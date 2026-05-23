// Glassmorphism feature cards with icons
import { motion } from "framer-motion";
import {
  FiCpu, FiDatabase, FiBell, FiActivity, FiMapPin, FiShield,
} from "react-icons/fi";

const features = [
  { icon: FiCpu,      title: "AI Detection",         desc: "Deep learning model identifies bird species from a single photo." },
  { icon: FiDatabase, title: "Gujarat Bird Database",desc: "Comprehensive database of birds native to Gujarat region." },
  { icon: FiBell,     title: "Rare Bird Alerts",     desc: "Get notified when you spot a rare or endangered species." },
  { icon: FiActivity, title: "Disease Information",  desc: "Learn about common avian diseases and prevention." },
  { icon: FiMapPin,   title: "Habitat Details",      desc: "Discover where each species lives, nests and migrates." },
  { icon: FiShield,   title: "Conservation Status",  desc: "IUCN status and population trends for every species." },
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Everything you need to <span className="gradient-text">explore birds</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful AI tools paired with rich data on Gujarat's incredible avian biodiversity.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl glass p-6 shadow-soft hover:shadow-elegant transition-shadow"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
