import { Link } from "react-router-dom";

export default function Sidebar() {
 const menu = [

  { name: "Dashboard", path: "/dashboard" },
  { name: "Employees", path: "/dashboard/employees" },
  { name: "Cadres", path: "/dashboard/cadres" },
  { name: "Designations", path: "/dashboard/designations" },
  { name: "Groups", path: "/dashboard/groups" },
  {
    name: "Internal Designations",
    path: "/dashboard/internal-designations",
  },
  { name: "Admin", path: "/dashboard/admin" },

];
  return (
    <aside className="bg-[#073B4C] text-white w-72 min-h-screen">
      <div className="p-5 font-semibold border-b border-gray-500">
        Navigation
      </div>

      <ul>
        {menu.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className="block px-5 py-4 hover:bg-[#0F4C5C]"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
