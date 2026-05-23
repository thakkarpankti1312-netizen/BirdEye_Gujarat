// Animated count-up statistics cards
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { FiFeather, FiTarget, FiCpu, FiImage } from "react-icons/fi";

const stats = [
  { icon: FiFeather, label: "Bird Species", end: 30, suffix: "+" },
  { icon: FiTarget,  label: "Model Accuracy", end: 95, suffix: "%" },
  { icon: FiCpu,     label: "Detection System", custom: "AI Powered" },
  { icon: FiImage,   label: "Dataset Images", end: 2400, suffix: "+" },
];

export default function Stats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="px-4 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-2xl glass p-6 shadow-soft hover-lift"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-3xl sm:text-4xl font-extrabold gradient-text">
                {s.custom ? (
                  <span className="text-2xl sm:text-3xl">{s.custom}</span>
                ) : (
                  <>
                    {inView && <CountUp end={s.end!} duration={2.2} />}
                    {s.suffix}
                  </>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
