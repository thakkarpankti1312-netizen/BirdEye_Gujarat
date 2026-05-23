// Black warning bar at the very top of the landing page
import { FiAlertTriangle } from "react-icons/fi";

export default function WarningBar() {
  return (
    <div className="w-full bg-black text-white text-xs sm:text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="text-yellow-400" />
          <span>You're viewing user-generated content that may be unverified or unsafe.</span>
        </div>
        <a href="#" className="underline opacity-80 hover:opacity-100">Report</a>
      </div>
    </div>
  );
}
