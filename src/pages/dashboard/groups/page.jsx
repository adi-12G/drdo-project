"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    short_name: "",
    full_name: "",
  });

  const fetchGroups = async () => {
    const res = await apiFetch("/groups");
    const data = await res.json();
    setGroups(data);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiFetch("/groups", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setFormData({ short_name: "", full_name: "" });
    fetchGroups();
  };

  const deleteGroup = async (id) => {
    await apiFetch(`/groups/${id}`, { method: "DELETE" });
    fetchGroups();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#073B4C]">Groups</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-6 flex gap-2"
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
          className="border p-2 text-[#073B4C]"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
        />

        <button className="bg-[#0F4C5C] text-white px-4">Add Group</button>
      </form>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-[#073B4C]">ID</th>
            <th className="border p-3 text-[#073B4C]">Short Name</th>
            <th className="border p-3 text-[#073B4C]">Full Name</th>
            <th className="border p-3 text-[#073B4C]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <tr key={group.group_id}>
              <td className="border p-3 text-[#073B4C]">{group.group_id}</td>
              <td className="border p-3 text-[#073B4C]">{group.short_name}</td>
              <td className="border p-3 text-[#073B4C]">{group.full_name}</td>
              <td className="border p-3 text-[#073B4C]">
                <button
                  onClick={() => deleteGroup(group.group_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-gray-600 mt-3">
        Update is not supported by the backend for groups, so this page currently supports list, create, and delete.
      </p>
    </div>
  );
}
