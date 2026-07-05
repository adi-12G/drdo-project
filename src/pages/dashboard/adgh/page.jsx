"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

const emptyFormData = {
  display_name: "",
  emp_id: "",
  group_id: "",
  username: "",
  password: "",
};

export default function ADGHPage() {
  const [adgh, setAdgh] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyFormData);

  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  }

  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

  function handleUnauthorized() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.location.href = "/";
  }

  const fetchADGH = async () => {
    try {
      const res = await apiFetch("/adgh");

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load ADGH");
      }

      setAdgh(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setAdgh([]);
      setError(err.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await apiFetch("/employees");

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await apiFetch("/groups");

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchADGH();
    fetchEmployees();
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await apiFetch("/adgh", {
      method: "POST",
      body: JSON.stringify({
        display_name: formData.display_name,
        emp_id: Number(formData.emp_id),
        group_id: Number(formData.group_id),
        username: formData.username,
        password: formData.password,
      }),
    });

    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to create ADGH");
    }

    setFormData(emptyFormData);

    fetchADGH();
  } catch (err) {
    setError(err.message);
  }
};

const deleteADGH = async (id) => {
  if (!window.confirm("Delete this ADGH user?")) {
    return;
  }

  try {
    const res = await apiFetch(`/adgh/${id}`, {
      method: "DELETE",
    });

    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Delete failed");
    }

    fetchADGH();
  } catch (err) {
    setError(err.message);
  }
};

return (
  <div>
    <h1 className="text-3xl font-bold mb-6 text-[#073B4C]">
      ADGH Management
    </h1>

    {error ? (
      <p className="text-sm text-red-600 mb-4">{error}</p>
    ) : null}

    {isAdmin ? (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-6 grid grid-cols-3 gap-3"
      >
        <input
          type="text"
          placeholder="Display Name"
          className="border p-2 text-[#073B4C]"
          value={formData.display_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              display_name: e.target.value,
            })
          }
        />

        <select
          className="border p-2 text-[#073B4C]"
          value={formData.emp_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              emp_id: e.target.value,
            })
          }
        >
          <option value="">Select Employee</option>

          {employees.map((employee) => (
            <option
              key={employee.emp_id}
              value={employee.emp_id}
            >
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 text-[#073B4C]"
          value={formData.group_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              group_id: e.target.value,
            })
          }
        >
          <option value="">Select Group</option>

          {groups.map((group) => (
            <option
              key={group.group_id}
              value={group.group_id}
            >
              {group.full_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 text-[#073B4C]"
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 text-[#073B4C]"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <div className="col-span-3">
          <button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">
            Add ADGH
          </button>
        </div>
      </form>
    ) : null}

    <table className="w-full bg-white border">
      <thead className="bg-gray-200">
        <tr>
          <th className="border p-3 text-[#073B4C]">ID</th>
          <th className="border p-3 text-[#073B4C]">Display Name</th>
          <th className="border p-3 text-[#073B4C]">Employee</th>
          <th className="border p-3 text-[#073B4C]">Group</th>
          <th className="border p-3 text-[#073B4C]">Username</th>

          {isAdmin ? (
            <th className="border p-3 text-[#073B4C]">Actions</th>
          ) : null}
        </tr>
      </thead>

      <tbody>
        {adgh.map((item) => (
          <tr key={item.id}>
            <td className="border p-3 text-[#073B4C]">
              {item.id}
            </td>

            <td className="border p-3 text-[#073B4C]">
              {item.display_name}
            </td>

            <td className="border p-3 text-[#073B4C]">
              {item.first_name} {item.last_name}
            </td>

            <td className="border p-3 text-[#073B4C]">
              {item.group_name}
            </td>

            <td className="border p-3 text-[#073B4C]">
              {item.username}
            </td>

            {isAdmin ? (
              <td className="border p-3">
                <button
                  onClick={() => deleteADGH(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            ) : null}
          </tr>
        ))}

        {adgh.length === 0 ? (
          <tr>
            <td
              colSpan={isAdmin ? 6 : 5}
              className="border p-4 text-center text-gray-500"
            >
              No ADGH records found.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>

    {!isAdmin ? (
      <p className="text-sm text-gray-600 mt-3">
        You can view ADGH records here.
      </p>
    ) : null}
  </div>
);
}
