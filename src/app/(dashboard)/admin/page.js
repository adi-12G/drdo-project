"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    g_id: "",
    username: "",
    password: "",
    user_type: "",
  });

  const fetchAdmins = async () => {
    const res = await apiFetch("/admins");
    const data = await res.json();
    setAdmins(data);
  };

  const fetchGroups = async () => {
    const res = await apiFetch("/groups");
    const data = await res.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchAdmins();
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiFetch("/admins", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        g_id: formData.g_id || null,
      }),
    });

    setFormData({
      name: "",
      g_id: "",
      username: "",
      password: "",
      user_type: "",
    });

    fetchAdmins();
  };

  const deleteAdmin = async (id) => {
    await apiFetch(`/admins/${id}`, { method: "DELETE" });
    fetchAdmins();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">Admins</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-6 flex flex-wrap gap-2"
      >
        <input
          type="text"
          placeholder="Name"
          className="border p-2 text-black"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />

        <select
          className="border p-2 text-black"
          value={formData.g_id}
          onChange={(e) =>
            setFormData({ ...formData, g_id: e.target.value })
          }
        >
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.full_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Username"
          className="border p-2 text-black"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 text-black"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="User Type"
          className="border p-2 text-black"
          value={formData.user_type}
          onChange={(e) =>
            setFormData({ ...formData, user_type: e.target.value })
          }
        />

        <button className="bg-[#0F4C5C] text-white px-4">Add Admin</button>
      </form>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-[#073B4C]">ID</th>
            <th className="border p-3 text-[#073B4C]">Name</th>
            <th className="border p-3 text-[#073B4C]">Group</th>
            <th className="border p-3 text-[#073B4C]">Username</th>
            <th className="border p-3 text-[#073B4C]">User Type</th>
            <th className="border p-3 text-[#073B4C]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td className="border p-3 text-[#073B4C]">{admin.id}</td>
              <td className="border p-3 text-[#073B4C]">{admin.name}</td>
              <td className="border p-3 text-[#073B4C]">{admin.group_name || "-"}</td>
              <td className="border p-3 text-[#073B4C]">{admin.username}</td>
              <td className="border p-3 text-[#073B4C]">{admin.user_type}</td>
              <td className="border p-3 text-[#073B4C]">
                {admin.username === "admin" ? (
                  <span className="text-gray-500">Seeded admin</span>
                ) : (
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-gray-600 mt-3">
        Update is not supported by the backend for admins, so this page currently supports list, create, and delete.
      </p>
    </div>
  );
}
