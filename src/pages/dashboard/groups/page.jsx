"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    short_name: "",
    full_name: "",
  });

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
      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

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

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiFetch("/groups", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to create group");
      }

      setFormData({ short_name: "", full_name: "" });
      fetchGroups();
    } catch (submitError) {
      setError(submitError.message || "Failed to create group");
    }
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Delete this group? This cannot be undone.")) {
      return;
    }

    try {
      const res = await apiFetch(`/groups/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete group");
      }

      fetchGroups();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete group");
    }
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

          <div className="col-span-3">
            <button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">
              Add Group
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
            {isAdmin ? <th className="border p-3 text-[#073B4C]">Actions</th> : null}
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <tr key={group.group_id}>
              <td className="border p-3 text-[#073B4C]">{group.group_id}</td>
              <td className="border p-3 text-[#073B4C]">{group.short_name}</td>
              <td className="border p-3 text-[#073B4C]">{group.full_name}</td>
              {isAdmin ? (
                <td className="border p-3 text-[#073B4C]">
                  <button
                    onClick={() => deleteGroup(group.group_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
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
