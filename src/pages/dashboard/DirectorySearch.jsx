import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function DirectorySearch() {
  const [term, setTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/employees");
        if (!res.ok) return;
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const results = term.trim()
    ? employees
        .filter((e) => {
          const t = term.toLowerCase();
          const name = `${e.first_name || ""} ${e.last_name || ""}`.toLowerCase();
          return (
            name.includes(t) ||
            (e.pis_number || "").toLowerCase().includes(t) ||
            (e.email || "").toLowerCase().includes(t)
          );
        })
        .slice(0, 8)
    : [];

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 mb-3">Find a Colleague</h3>
      <input
        type="text"
        placeholder="Search by name, PIS number, or email..."
        className="border p-2 text-black w-full rounded"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      {term.trim() ? (
        <div className="mt-3 border rounded divide-y max-h-64 overflow-y-auto">
          {loaded && results.length === 0 ? (
            <p className="text-sm text-gray-400 p-3">No matches found.</p>
          ) : (
            results.map((emp) => (
              <div key={emp.emp_id} className="p-3 text-sm">
                <p className="font-medium text-[#073B4C]">
                  {emp.first_name} {emp.last_name}
                </p>
                <p className="text-gray-500">
                  {emp.pis_number} {emp.email ? `· ${emp.email}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}