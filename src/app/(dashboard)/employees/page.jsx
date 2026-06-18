"use client";

import { useEffect, useState } from "react";

export default function InternalDesignationsPage() {
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    sname: "",
    full_name: "",
  });

  const fetchDesignations = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/internal-designations"
    );

    const data = await res.json();

    setDesignations(data);
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(
      "http://127.0.0.1:5000/internal-designations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    setFormData({
      sname: "",
      full_name: "",
    });

    fetchDesignations();
  };

  const deleteDesignation = async (id) => {
    await fetch(
      `http://127.0.0.1:5000/internal-designations/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchDesignations();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">
        Internal Designations
      </h1>

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
            setFormData({
              ...formData,
              sname: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 text-black"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({
              ...formData,
              full_name: e.target.value,
            })
          }
        />
   

        <button
          className="bg-[#0F4C5C] text-white px-4"
        >
          Add Internal Designation
        </button>
      </form>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-[#073B4C]">
              ID
            </th>

            <th className="border p-3 text-[#073B4C]">
              Short Name
            </th>

            <th className="border p-3 text-[#073B4C]">
              Full Name
            </th>

            <th className="border p-3 text-[#073B4C]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {designations.map((designation) => (
            <tr
              key={
                designation.internal_designation_id
              }
            >
              <td className="border p-3 text-[#073B4C]">
                {
                  designation.internal_designation_id
                }
              </td>

              <td className="border p-3 text-[#073B4C]">
                {designation.sname}
              </td>

              <td className="border p-3 text-[#073B4C]">
                {designation.full_name}
              </td>

              <td className="border p-3 text-[#073B4C]">
                <button
                  onClick={() =>
                    deleteDesignation(
                      designation.internal_designation_id
                    )
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}