// Reusable swan logo with brand name
import logo from "@/assets/logo.png";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="Gujarat Bird AI logo" className="h-9 w-9 object-contain" />
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}>
        BirdEye <span className="gradient-text">Gujarat</span>
      </span>
    </div>
  );
}
