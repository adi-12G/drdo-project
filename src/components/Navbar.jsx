"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.replace("/login");
  };

  return (
    <header className="bg-[#0F4C5C] text-white h-16 flex items-center justify-between px-6 shadow">
      <div className="flex items-center">
        <img
          src="/drdo-logo.png"
          alt="DRDO"
          className="h-10 w-10 mr-4"
        />

        <div>
          <h1 className="font-semibold text-lg">
            DRDO Employee Management System
          </h1>

          <p className="text-xs text-gray-200">
            Defence Research and Development Organisation
          </p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="rounded bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
      >
        Logout
      </button>
    </header>
  );
}