"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    emp_id: "",
    group_id: "",
    username: "",
    password: "",
    user_type: "",
  });

  const fetchAdmins = async () => {
    const res = await fetch(
      "http://127.0.0.1:5000/admins"
    );

    const data = await res.json();

    setAdmins(data);
  };

  useEffect(() => {
    fetchAdmins();

    fetch("http://127.0.0.1:5000/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));

    fetch("http://127.0.0.1:5000/groups")
      .then((res) => res.json())
      .then((data) => setGroups(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(
      "http://127.0.0.1:5000/admins",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    setFormData({
      emp_id: "",
      group_id: "",
      username: "",
      password: "",
      user_type: "",
    });

    fetchAdmins();
  };




  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">
        Admins
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow mb-6 flex flex-wrap gap-2"
      >
        <select
          className="border p-2 text-black"
          value={formData.emp_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              emp_id: e.target.value,
            })
          }
        >
          <option value="">
            Select Employee
          </option>

          {employees.map((employee) => (
            <option
              key={employee.emp_id}
              value={employee.emp_id}
            >
              {employee.first_name}{" "}
              {employee.last_name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 text-black"
          value={formData.group_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              group_id: e.target.value,
            })
          }
        >
          <option value="">
            Select Group
          </option>

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
          className="border p-2 text-black"
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
          className="border p-2 text-black"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="User Type"
          className="border p-2 text-black"
          value={formData.user_type}
          onChange={(e) =>
            setFormData({
              ...formData,
              user_type: e.target.value,
            })
          }
        />

        <button
          className="bg-[#0F4C5C] text-white px-4"
        >
          Add Admin
        </button>
      </form>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3 text-[#073B4C]">
              ID
            </th>

            <th className="border p-3 text-[#073B4C]">
              Employee
            </th>

            <th className="border p-3 text-[#073B4C]">
              Group
            </th>

            <th className="border p-3 text-[#073B4C]">
              Username
            </th>

            <th className="border p-3 text-[#073B4C]">
              User Type
            </th>

            <th className="border p-3 text-[#073B4C]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {admins.map((admin) => (
            <tr key={admin.admin_id}>
              <td className="border p-3 text-[#073B4C]">
                {admin.admin_id}
              </td>

              <td className="border p-3 text-[#073B4C]">
                {admin.emp_id}
              </td>

              <td className="border p-3 text-[#073B4C]">
                {admin.group_id}
              </td>

              <td className="border p-3 text-[#073B4C]">
                {admin.username}
              </td>

              <td className="border p-3 text-[#073B4C]">
                {admin.user_type}
              </td>

              <td className="border p-3">
                <button
                  onClick={() =>
                    deleteAdmin(admin.admin_id)
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