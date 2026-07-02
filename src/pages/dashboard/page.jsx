import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    employees: "--",
    cadres: "--",
    designations: "--",
    groups: "--",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const res = await apiFetch("/dashboard");

        if (res.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          navigate("/login", { replace: true });
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load dashboard");
        }

        if (!cancelled) {
          setStats(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "Failed to load dashboard");
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#073B4C] mb-6">
        DRDO Employee Management System
      </h1>

      {error ? (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      ) : null}

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Employees
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            {stats.employees}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Cadres
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            {stats.cadres}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Designations
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            {stats.designations}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Groups
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            {stats.groups}
          </p>
        </div>
      </div>
    </div>
  );
}