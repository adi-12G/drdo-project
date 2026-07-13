"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

const emptyFormData = {
  short_name: "",
  full_name: "",
  ad_id: "",
  gh_id: "",
  va1_id: "",
  va2_id: "",
};

function employeeLabel(employee) {
  const name = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
  return employee.pis_number ? `${name} (${employee.pis_number})` : name;
}

function adghLabel(record) {
  return record.display_name || `ADGH #${record.id}`;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [adghEmployees, setAdghEmployees] = useState([]);
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

  const fetchGroups = async () => {
    try {
      const res = await apiFetch("/groups");

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load groups");
      }

      setGroups(Array.isArray(data) ? data : []);
      setError("");
    } catch (fetchError) {
      setGroups([]);
      setError(fetchError.message || "Failed to load groups");
    }
  };
const editGroup = (group) => {
  setEditingId(group.group_id);

  setFormData({
    short_name: group.short_name,
    full_name: group.full_name,
    ad_id: group.ad_id || "",
    gh_id: group.gh_id || "",
    va1_id: group.va1_id || "",
    va2_id: group.va2_id || "",
  });
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
        throw new Error(data.error || "Failed to load employees");
      }

      setEmployees(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      // Non-fatal: the form still works, it just falls back to showing
      // raw IDs instead of names in the dropdowns/table.
      setEmployees([]);
    }
  };

  const fetchAdghEmployees = async () => {
    try {
      const res = await apiFetch("/adgh");

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load ADGH employees");
      }

      setAdghEmployees(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      // Non-fatal: the form still works, it just falls back to showing
      // raw IDs instead of names in the dropdowns/table.
      setAdghEmployees([]);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchEmployees();
    fetchAdghEmployees();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    let res;

    if (editingId) {
      res = await apiFetch(`/groups/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          ad_id: formData.ad_id || null,
          gh_id: formData.gh_id || null,
          va1_id: formData.va1_id || null,
          va2_id: formData.va2_id || null,
        }),
      });
    } else {
      res = await apiFetch("/groups", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          ad_id: formData.ad_id || null,
          gh_id: formData.gh_id || null,
          va1_id: formData.va1_id || null,
          va2_id: formData.va2_id || null,
        }),
      });
    }

    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
          (editingId
            ? "Failed to update group"
            : "Failed to create group")
      );
    }

    setFormData(emptyFormData);
    setEditingId(null);
    fetchGroups();
  } catch (submitError) {
    setError(
      submitError.message ||
        (editingId
          ? "Failed to update group"
          : "Failed to create group")
    );
  }
};

  const deleteGroup = async (id) => {
    if (!window.confirm("Delete this group? This cannot be undone.")) {
      return;
    }

    setError("");

    try {
      const res = await apiFetch(`/groups/${id}`, { method: "DELETE" });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete group");
      }

      fetchGroups();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete group");
    }
  };

  const employeeName = (id) => {
    if (!id) return "";
    const match = employees.find(
      (employee) => String(employee.emp_id) === String(id)
    );
    return match ? employeeLabel(match) : id;
  };

  const adghName = (id) => {
    if (!id) return "";
    const match = adghEmployees.find((employee) => String(employee.id) === String(id));
    return match ? adghLabel(match) : id;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#073B4C]">Groups</h1>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      {isAdmin ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded shadow mb-6 grid grid-cols-3 gap-3"
        >
          <input
            type="text"
            placeholder="Short Name"
            className="border p-2 text-[#073B4C]"
            value={formData.short_name}
            onChange={(e) =>
              setFormData({ ...formData, short_name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 text-[#073B4C] col-span-2"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />

          <label className="flex flex-col text-xs text-gray-600">
            AD
            <select
              className="border p-2 text-[#073B4C]"
              value={formData.ad_id}
              onChange={(e) =>
                setFormData({ ...formData, ad_id: e.target.value })
              }
            >
              <option value="">Select AD</option>
              {adghEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {adghLabel(employee)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-xs text-gray-600">
            GH
            <select
              className="border p-2 text-[#073B4C]"
              value={formData.gh_id}
              onChange={(e) =>
                setFormData({ ...formData, gh_id: e.target.value })
              }
            >
              <option value="">Select GH</option>
              {adghEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {adghLabel(employee)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-xs text-gray-600">
            VA1
            <select
              className="border p-2 text-[#073B4C]"
              value={formData.va1_id}
              onChange={(e) =>
                setFormData({ ...formData, va1_id: e.target.value })
              }
            >
              <option value="">Select VA1</option>
              {employees.map((employee) => (
                <option key={employee.emp_id} value={employee.emp_id}>
                  {employeeLabel(employee)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-xs text-gray-600">
            VA2
            <select
              className="border p-2 text-[#073B4C]"
              value={formData.va2_id}
              onChange={(e) =>
                setFormData({ ...formData, va2_id: e.target.value })
              }
            >
              <option value="">Select VA2</option>
              {employees.map((employee) => (
                <option key={employee.emp_id} value={employee.emp_id}>
                  {employeeLabel(employee)}
                </option>
              ))}
            </select>
          </label>

          <div className="col-span-3">
            <button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">
              {editingId ? "Update Group" : "Add Group"}
            </button>
          </div>
        </form>
      ) : null}

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-[#073B4C]">ID</th>
            <th className="border p-3 text-[#073B4C]">Short Name</th>
            <th className="border p-3 text-[#073B4C]">Full Name</th>
            <th className="border p-3 text-[#073B4C]">AD</th>
            <th className="border p-3 text-[#073B4C]">GH</th>
            <th className="border p-3 text-[#073B4C]">VA1</th>
            <th className="border p-3 text-[#073B4C]">VA2</th>
            {isAdmin ? <th className="border p-3 text-[#073B4C]">Actions</th> : null}
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <tr key={group.group_id}>
              <td className="border p-3 text-[#073B4C]">{group.group_id}</td>
              <td className="border p-3 text-[#073B4C]">{group.short_name}</td>
              <td className="border p-3 text-[#073B4C]">{group.full_name}</td>
              <td className="border p-3 text-[#073B4C]">{adghName(group.ad_id)}</td>
              <td className="border p-3 text-[#073B4C]">{adghName(group.gh_id)}</td>
              <td className="border p-3 text-[#073B4C]">{employeeName(group.va1_id)}</td>
              <td className="border p-3 text-[#073B4C]">{employeeName(group.va2_id)}</td>
              {isAdmin ? (
                <td className="border p-3 text-[#073B4C]">
           <div className="flex gap-2">
  <button
    type="button"
    onClick={() => editGroup(group)}
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => deleteGroup(group.group_id)}
    className="bg-red-600 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
</div>
                </td>
              ) : null}
            </tr>
          ))}

          {groups.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 8 : 7} className="border p-4 text-center text-gray-500">
                No groups found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      {!isAdmin ? (
        <p className="text-sm text-gray-600 mt-3">
          You can view groups here.
        </p>
      ) : null}
    </div>
  );
}
