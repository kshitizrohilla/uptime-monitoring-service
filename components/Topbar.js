import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="bg-slate-800 text-white p-4 text-xs fixed w-full z-10 top-0 left-0">
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">Uptime Monitor</div>
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className={`lg:flex space-x-2 ${isMenuOpen ? "flex flex-col absolute top-14 right-0 bg-gray-800 w-full p-4" : "hidden"}`}>
          <Link href="/dashboard" className={`block p-3 lg:p-2 rounded-lg ${isActive('/dashboard') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Dashboard</Link>
          <Link href="/monitors" className={`block p-3 lg:p-2 rounded-lg ${isActive('/monitors') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Monitors</Link>
          <Link href="/incidents" className={`block p-3 lg:p-2 rounded-lg ${isActive('/incidents') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>Incidents</Link>
          <div className="lg:block">
            <button onClick={handleLogout} className="cursor-pointer w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg mt-2 lg:mt-0">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}