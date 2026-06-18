"use client";

import { useEffect, useState } from "react";

export default function DesignationsPage() {
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/designations")
      .then((res) => res.json())
      .then((data) => setDesignations(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#073B4C]">
        Designations
      </h1>

      <table className="w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2 text-[#073B4C]">
              ID
            </th>
            <th className="border p-2 text-[#073B4C]">
              Short Name
            </th>
            <th className="border p-2 text-[#073B4C]">
              Full Name
            </th>
            <th className="border p-2 text-[#073B4C]">
              Cadre
            </th>
          </tr>
        </thead>

        <tbody>
          {designations.map((d) => (
            <tr key={d.designation_id}>
              <td className="border p-2 text-[#073B4C]">
                {d.designation_id}
              </td>

              <td className="border p-2 text-[#073B4C]">
                {d.sname}
              </td>

              <td className="border p-2 text-[#073B4C]">
                {d.full_name}
              </td>

              <td className="border p-2 text-[#073B4C]">
                {d.cadre_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}