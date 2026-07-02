import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
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

        const payload = await res.json();

        if (!res.ok) {
          throw new Error(payload.error || "Failed to load dashboard");
        }

        if (!cancelled) {
          setData(payload);
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

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
      {!data && !error ? <p className="text-sm text-gray-500">Loading dashboard...</p> : null}

      {data && data.role === "admin" ? <AdminDashboard data={data} /> : null}
      {data && data.role !== "admin" ? <EmployeeDashboard data={data} /> : null}
    </div>
  );
}