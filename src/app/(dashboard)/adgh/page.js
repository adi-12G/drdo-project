"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ADGHPage() {
  const [adghs, setAdghs] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    display_name: "",
    emp_id: "",
    group_id: "",
    username: "",
    password: "",
  });

  const fetchADGH = async () => {
    const res = await apiFetch("/adgh");
    const data = await res.json();
    setAdghs(data);
  };

  const fetchGroups = async () => {
    const res = await apiFetch("/groups");
    const data = await res.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchADGH();
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiFetch("/adgh", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        emp_id: formData.emp_id || null,
        group_id: formData.group_id || null,
      }),
    });

    setFormData({
      display_name: "",
      emp_id: "",
      group_id: "",
      username: "",
      password: "",
    });

    fetchADGH();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">ADGH Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-6 flex flex-wrap gap-2"
      >
        <input
          type="text"
          placeholder="Display Name"
          className="border p-2 text-black"
          value={formData.display_name}
          onChange={(e) =>
            setFormData({ ...formData, display_name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Employee ID (optional)"
          className="border p-2 text-black"
          value={formData.emp_id}
          onChange={(e) =>
            setFormData({ ...formData, emp_id: e.target.value })
          }
        />

        <select
          className="border p-2 text-black"
          value={formData.group_id}
          onChange={(e) =>
            setFormData({ ...formData, group_id: e.target.value })
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

        <button className="bg-[#0F4C5C] text-white px-4">Add ADGH</button>
      </form>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-[#073B4C]">ID</th>
            <th className="border p-3 text-[#073B4C]">Display Name</th>
            <th className="border p-3 text-[#073B4C]">Employee ID</th>
            <th className="border p-3 text-[#073B4C]">Group</th>
            <th className="border p-3 text-[#073B4C]">Username</th>
            <th className="border p-3 text-[#073B4C]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(adghs) &&
            adghs.map((adgh) => (
              <tr key={adgh.id}>
                <td className="border p-3 text-[#073B4C]">{adgh.id}</td>
                <td className="border p-3 text-[#073B4C]">{adgh.display_name}</td>
                <td className="border p-3 text-[#073B4C]">{adgh.emp_id || "-"}</td>
                <td className="border p-3 text-[#073B4C]">{adgh.group_id || "-"}</td>
                <td className="border p-3 text-[#073B4C]">{adgh.username}</td>
                <td className="border p-3 text-[#073B4C]">
                  <span className="text-gray-500">
                    Delete/update not supported by backend
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <p className="text-sm text-gray-600 mt-3">
        The backend currently supports list and create for ADGH only. Delete/update are disabled here because no backend route exists for them.
      </p>
    </div>
  );
}
