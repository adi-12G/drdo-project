"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function CadresPage() {
  const [cadres, setCadres] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    sname: "",
    full_name: "",
  });

  const fetchCadres = async () => {
    try {
      const res = await apiFetch("/cadres");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load cadres");
      }

      setCadres(Array.isArray(data) ? data : []);
      setError("");
    } catch (fetchError) {
      setCadres([]);
      setError(fetchError.message || "Failed to load cadres");
    }
  };

  useEffect(() => {
    fetchCadres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiFetch("/cadres", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setFormData({ sname: "", full_name: "" });
    fetchCadres();
  };

  const deleteCadre = async (id) => {
    await apiFetch(`/cadres/${id}`, { method: "DELETE" });
    fetchCadres();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">Cadres</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="Short Name"
          className="border p-2 text-black"
          value={formData.sname}
          onChange={(e) =>
            setFormData({ ...formData, sname: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 text-black"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
        />

        <button className="bg-[#0F4C5C] text-white px-4">Add Cadre</button>
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
          {Array.isArray(cadres) && cadres.map((cadre) => (
            <tr key={cadre.cadre_id}>
              <td className="border p-3 text-[#073B4C]">{cadre.cadre_id}</td>
              <td className="border p-3 text-[#073B4C]">{cadre.sname}</td>
              <td className="border p-3 text-[#073B4C]">{cadre.full_name}</td>
              <td className="border p-3 text-[#073B4C]">
                <button
                  onClick={() => deleteCadre(cadre.cadre_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error ? (
        <p className="text-sm text-red-600 mt-3">
          {error}
        </p>
      ) : null}

      <p className="text-sm text-gray-600 mt-3">
        Update is not supported by the backend for cadres, so this page currently supports list, create, and delete.
      </p>
    </div>
  );
}
