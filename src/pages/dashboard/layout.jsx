import { NavLink, Outlet, useNavigate } from "react-router-dom";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/dashboard/employees", label: "Employees" },
  { to: "/dashboard/cadres", label: "Cadres" },
  { to: "/dashboard/designations", label: "Designations" },
  { to: "/dashboard/groups", label: "Groups" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-[#f3f7f9]">
      <aside className="w-64 bg-[#073B4C] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold">DRDO EMS</h2>
          {currentUser ? (
            <p className="text-sm text-white/70 mt-1">
              {currentUser.name} ({currentUser.role})
            </p>
          ) : null}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive ? "bg-white/10 font-semibold" : "hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}