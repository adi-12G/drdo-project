import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function Profile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await apiFetch("/employees/me");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load profile");
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
        Loading Profile...
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

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-[#073B4C]">
          My Profile
        </h1>

        <p className="text-gray-600 mt-2">
          View your personal and employment information.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold text-[#073B4C] mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-gray-500 text-sm">Employee ID</label>
            <p className="text-lg font-medium">{employee.emp_id}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">PIS Number</label>
            <p className="text-lg font-medium">{employee.pis_number || "-"}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">First Name</label>
            <p className="text-lg font-medium">{employee.first_name}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Middle Name</label>
            <p className="text-lg font-medium">
              {employee.middle_name || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Last Name</label>
            <p className="text-lg font-medium">{employee.last_name}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Gender</label>
            <p className="text-lg font-medium">
              {employee.gender || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Date of Birth</label>
            <p className="text-lg font-medium">
              {employee.dob || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Email</label>
            <p className="text-lg font-medium">
              {employee.email || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Mobile Number</label>
            <p className="text-lg font-medium">
              {employee.mobile || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Telephone</label>
            <p className="text-lg font-medium">
              {employee.tele_no || "-"}
            </p>
          </div>

        </div>

      </div>

      {/* Employment Information */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold text-[#073B4C] mb-6">
          Employment Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-gray-500 text-sm">Cadre</label>
            <p className="text-lg font-medium">
              {employee.cadre_name || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Designation</label>
            <p className="text-lg font-medium">
              {employee.designation_name || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Employee Group</label>
            <p className="text-lg font-medium">
              {employee.group_name || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Gazetted</label>
            <p className="text-lg font-medium">
              {employee.is_gazetted ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Status</label>
            <p className="text-lg font-medium">
              {employee.status ? "Active" : "Inactive"}
            </p>
          </div>

        </div>

      </div>

      {/* Notice */}

      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5">

        <p className="text-yellow-800">
          If any of your information is incorrect, please contact the administrator.
          Employees cannot modify their own records.
        </p>

      </div>

    </div>
  );
}