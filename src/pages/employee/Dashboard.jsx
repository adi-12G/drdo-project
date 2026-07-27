import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await apiFetch("/employees/me");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load dashboard");
      }

      setEmployee(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-xl font-semibold text-[#073B4C]">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#073B4C]">
          Employee Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Welcome, {employee.first_name}!
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm text-gray-500">Employee ID</h2>
          <p className="text-xl font-semibold text-[#073B4C] mt-2">
            {employee.emp_id}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm text-gray-500">Cadre</h2>
          <p className="text-xl font-semibold text-[#073B4C] mt-2">
            {employee.cadre_name || "-"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm text-gray-500">Designation</h2>
          <p className="text-xl font-semibold text-[#073B4C] mt-2">
            {employee.designation_name || "-"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm text-gray-500">Status</h2>
          <p
            className={`text-xl font-semibold mt-2 ${
              employee.status ? "text-green-600" : "text-red-600"
            }`}
          >
            {employee.status ? "Active" : "Inactive"}
          </p>
        </div>

      </div>

      {/* Information */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-[#073B4C] mb-4">
          Information
        </h2>

        <p className="text-gray-600 leading-7">
          This portal allows employees to view their personal and employment
          information. If any information is incorrect, please contact the
          administrator. Employees cannot modify their own records.
        </p>
      </div>

    </div>
  );
}