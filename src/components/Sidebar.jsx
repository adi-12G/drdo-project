import Link from "next/link";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Employees", path: "/employees" },
    { name: "Cadres", path: "/cadres" },
    { name: "Designations", path: "/designations" },
    { name: "Groups", path: "/groups" },
    { name: "Admin", path: "/admin" },
    { name: "ADGH", path: "/adgh" },
    {
  name: "Internal Designations",
  path: "/internal-designations",
}
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
              href={item.path}
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