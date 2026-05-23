// Hero section — two columns: text on the left, peacock image on the right
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import peacock from "@/assets/peacock.jpg";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-4 pt-16 pb-24">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full bg-primary-glow/30 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* LEFT: Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            AI Powered • Gujarat Birds
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            AI Based{" "}
            <span className="gradient-text">Gujarat Bird</span>{" "}
            Species Detection System
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground">
            Upload bird images and identify Gujarat bird species instantly using
            Artificial Intelligence. Explore habitat, conservation status, diet,
            diseases, and rare species alerts.
          </p>

          <div className="mt-8">
            <a
              href="#upload"
              className="group inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02]"
            >
              Get Started
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        {/* RIGHT: Peacock image card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] gradient-primary opacity-20 blur-2xl" />
          <div className="group relative overflow-hidden rounded-[2rem] shadow-elegant ring-1 ring-primary/15">
            <img
              src={peacock}
              alt="Indian Peafowl with full tail spread"
              width={1024}
              height={1024}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Floating info card */}
            <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl px-4 py-3 shadow-soft">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">State Bird</p>
              <p className="text-sm font-bold">Indian Peafowl • Pavo cristatus</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
