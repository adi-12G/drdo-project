"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function DesignationsPage() {
  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  }

  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

  const [designations, setDesignations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [cadres, setCadres] = useState([]);
  const [formData, setFormData] = useState({
    cadre_id: "",
    sname: "",
    full_name: "",
  });
  const [error, setError] = useState("");

  function handleUnauthorized() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.location.href = "/";
  }

  const fetchDesignations = async () => {
    try {
      const res = await apiFetch("/designations");
      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to load designations");
      }

      setDesignations(Array.isArray(data) ? data : []);
      setError("");
    } catch (fetchError) {
      setDesignations([]);
      setError(fetchError.message || "Failed to load designations");
    }
  };

  const fetchCadres = async () => {
    try {
      const res = await apiFetch("/cadres");
      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to load cadres");
      }

      setCadres(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setCadres([]);
      setError(fetchError.message || "Failed to load cadres");
    }
  };

  useEffect(() => {
    fetchDesignations();
    fetchCadres();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let res;

    if (editingId) {
      res = await apiFetch(`/designations/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          cadre_id: formData.cadre_id || null,
        }),
      });
    } else {
      res = await apiFetch("/designations", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          cadre_id: formData.cadre_id || null,
        }),
      });
    }

    const data = await res.json();

    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!res.ok) {
      throw new Error(
        data.error ||
          (editingId
            ? "Failed to update designation"
            : "Failed to create designation")
      );
    }

    setFormData({
      cadre_id: "",
      sname: "",
      full_name: "",
    });

    setEditingId(null);
    fetchDesignations();
  } catch (submitError) {
    setError(
      submitError.message ||
        (editingId
          ? "Failed to update designation"
          : "Failed to create designation")
    );
  }
};

  const editDesignation = (designation) => {
	setEditingId(designation.designation_id);

	setFormData({
		cadre_id: designation.cadre_id,
		sname: designation.sname,
		full_name: designation.full_name,
	});
};

  const deleteDesignation = async (id) => {
    if (!window.confirm("Delete this designation? This cannot be undone.")) {
      return;
    }

    try {
      const res = await apiFetch(`/designations/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete designation");
      }

      fetchDesignations();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete designation");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#073B4C]">Designations</h1>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      {isAdmin ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded shadow mb-6 grid grid-cols-3 gap-3"
        >
          <select
            className="border p-2 text-[#073B4C]"
            value={formData.cadre_id}
            onChange={(e) =>
              setFormData({ ...formData, cadre_id: e.target.value })
            }
          >
            <option value="">Select Cadre</option>
            {cadres.map((cadre) => (
              <option key={cadre.cadre_id} value={cadre.cadre_id}>
                {cadre.full_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Short Name"
            className="border p-2 text-[#073B4C]"
            value={formData.sname}
            onChange={(e) => setFormData({ ...formData, sname: e.target.value })}
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

          <div className="col-span-3">
            <button
    type="submit"
    className="bg-[#0F4C5C] text-white px-4 py-2 rounded"
>
    {editingId ? "Update Designation" : "Add Designation"}
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
            <th className="border p-3 text-[#073B4C]">Cadre</th>
            {isAdmin ? <th className="border p-3 text-[#073B4C]">Actions</th> : null}
          </tr>
        </thead>

        <tbody>
          {designations.map((d) => (
            <tr key={d.designation_id}>
              <td className="border p-3 text-[#073B4C]">{d.designation_id}</td>
              <td className="border p-3 text-[#073B4C]">{d.sname}</td>
              <td className="border p-3 text-[#073B4C]">{d.full_name}</td>
              <td className="border p-3 text-[#073B4C]">{d.cadre_name}</td>
              {isAdmin ? (
                <td className="border p-3 text-[#073B4C]">
                 
	<div className="flex gap-2">
    <button
        type="button"
        onClick={() => editDesignation(d)}
        className="bg-blue-600 text-white px-3 py-1 rounded"
    >
        Edit
    </button>

    <button
        type="button"
        onClick={() => deleteDesignation(d.designation_id)}
        className="bg-red-600 text-white px-3 py-1 rounded"
    >
        Delete
    </button>
</div>

                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>

      {!isAdmin ? (
        <p className="text-sm text-gray-600 mt-3">
          You can view designations here.
        </p>
      ) : null}
    </div>
  );
}
