import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch {
    return null;
  }
}

const emptyCreateForm = {
  pis_number: "",
  first_name: "",
  last_name: "",
  email: "",
  cadre_id: "",
  designation_id: "",
  internal_designation_id: "",
  group_id: "",
};

const emptyEditForm = {
  first_name: "",
  last_name: "",
  email: "",
};

export default function EmployeesPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();
  const isAdmin = currentUser?.role === "admin";

  const [employees, setEmployees] = useState([]);
  const [cadres, setCadres] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [internalDesignations, setInternalDesignations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [searchTerm, setSearchTerm] = useState("");

  function handleUnauthorized() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/", { replace: true });
  }

  function showSuccess(message) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  }

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
      setError("");
    } catch (fetchError) {
      setEmployees([]);
      setError(fetchError.message || "Failed to load employees");
    }
  };

  const fetchLookups = async () => {
    try {
      const [cadresRes, designationsRes, internalRes, groupsRes] = await Promise.all([
        apiFetch("/cadres"),
        apiFetch("/designations"),
        apiFetch("/internal-designations"),
        apiFetch("/groups"),
      ]);

      if ([cadresRes, designationsRes, internalRes, groupsRes].some((r) => r.status === 401)) {
        handleUnauthorized();
        return;
      }

      const [cadresData, designationsData, internalData, groupsData] = await Promise.all([
        cadresRes.json(),
        designationsRes.json(),
        internalRes.json(),
        groupsRes.json(),
      ]);

      setCadres(Array.isArray(cadresData) ? cadresData : []);
      setDesignations(Array.isArray(designationsData) ? designationsData : []);
      setInternalDesignations(Array.isArray(internalData) ? internalData : []);
      setGroups(Array.isArray(groupsData) ? groupsData : []);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load form options");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/employees", {
        method: "POST",
        body: JSON.stringify({
          ...createForm,
          cadre_id: createForm.cadre_id || null,
          designation_id: createForm.designation_id || null,
          internal_designation_id: createForm.internal_designation_id || null,
          group_id: createForm.group_id || null,
        }),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create employee");
      }

      setCreateForm(emptyCreateForm);
      showSuccess("Employee successfully added");
      fetchEmployees();
    } catch (createError) {
      setError(createError.message || "Failed to create employee");
    }
  };

  const startEdit = (employee) => {
    setEditingEmployeeId(employee.emp_id);
    setEditForm({
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      email: employee.email || "",
    });
  };

  const cancelEdit = () => {
    setEditingEmployeeId(null);
    setEditForm(emptyEditForm);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editingEmployeeId) {
      return;
    }

    setError("");

    try {
      const res = await apiFetch(`/employees/${editingEmployeeId}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update employee");
      }

      cancelEdit();
      showSuccess("Employee successfully updated");
      fetchEmployees();
    } catch (editErr) {
      setError(editErr.message || "Failed to update employee");
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee? This cannot be undone.")) {
      return;
    }

    setError("");

    try {
      const res = await apiFetch(`/employees/${id}`, { method: "DELETE" });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete employee");
      }

      showSuccess("Employee successfully deleted");
      fetchEmployees();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete employee");
    }
  };

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.toLowerCase();
        return (
          fullName.includes(term) ||
          (employee.pis_number || "").toLowerCase().includes(term) ||
          (employee.email || "").toLowerCase().includes(term)
        );
      })
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-black">Employees</h1>

      {successMessage ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 flex items-center justify-between">
          <span className="text-sm">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-700 font-bold ml-4"
          >
            ×
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      ) : null}

      {isAdmin ? (
        <form
          onSubmit={handleCreate}
          className="bg-white p-5 rounded shadow mb-6 grid grid-cols-2 gap-2"
        >
          <input
            type="text"
            placeholder="PIS Number"
            className="border p-2 text-black"
            value={createForm.pis_number}
            onChange={(e) =>
              setCreateForm({ ...createForm, pis_number: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="First Name"
            className="border p-2 text-black"
            value={createForm.first_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, first_name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 text-black"
            value={createForm.last_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, last_name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 text-black"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
          />

          <select
            className="border p-2 text-black"
            value={createForm.cadre_id}
            onChange={(e) =>
              setCreateForm({ ...createForm, cadre_id: e.target.value })
            }
          >
            <option value="">Select Cadre</option>
            {cadres.map((cadre) => (
              <option key={cadre.cadre_id} value={cadre.cadre_id}>
                {cadre.full_name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 text-black"
            value={createForm.designation_id}
            onChange={(e) =>
              setCreateForm({ ...createForm, designation_id: e.target.value })
            }
          >
            <option value="">Select Designation</option>
            {designations.map((designation) => (
              <option
                key={designation.designation_id}
                value={designation.designation_id}
              >
                {designation.full_name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 text-black"
            value={createForm.internal_designation_id}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                internal_designation_id: e.target.value,
              })
            }
          >
            <option value="">Select Internal Designation</option>
            {internalDesignations.map((item) => (
              <option
                key={item.internal_designation_id}
                value={item.internal_designation_id}
              >
                {item.full_name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 text-black"
            value={createForm.group_id}
            onChange={(e) =>
              setCreateForm({ ...createForm, group_id: e.target.value })
            }
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.group_id} value={group.group_id}>
                {group.full_name}
              </option>
            ))}
          </select>

          <div className="col-span-2">
            <button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">
              Add Employee
            </button>
          </div>
        </form>
      ) : null}

      {isAdmin && editingEmployeeId ? (
        <form
          onSubmit={handleEdit}
          className="bg-white p-5 rounded shadow mb-6 grid grid-cols-2 gap-2"
        >
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 text-black"
            value={editForm.first_name}
            onChange={(e) =>
              setEditForm({ ...editForm, first_name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 text-black"
            value={editForm.last_name}
            onChange={(e) =>
              setEditForm({ ...editForm, last_name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 text-black"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
          />

          <div className="flex gap-2">
            <button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">
              Save Changes
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, PIS number, or email..."
          className="border p-2 text-black w-full max-w-md rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-[#073B4C]">ID</th>
            <th className="border p-2 text-[#073B4C]">PIS</th>
            <th className="border p-2 text-[#073B4C]">Name</th>
            <th className="border p-2 text-[#073B4C]">Email</th>
            <th className="border p-2 text-[#073B4C]">Status</th>
            {isAdmin ? <th className="border p-2 text-[#073B4C]">Actions</th> : null}
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.emp_id}>
              <td className="border p-2 text-[#073B4C]">{employee.emp_id}</td>
              <td className="border p-2 text-[#073B4C]">{employee.pis_number}</td>
              <td className="border p-2 text-[#073B4C]">
                {employee.first_name} {employee.last_name}
              </td>
              <td className="border p-2 text-[#073B4C]">{employee.email}</td>
              <td className="border p-2 text-[#073B4C]">
                {employee.status ? "Active" : "Inactive"}
              </td>
              {isAdmin ? (
                <td className="border p-2 text-[#073B4C]">
                  <button
                    onClick={() => startEdit(employee)}
                    className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.emp_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}

          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="border p-4 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <p className="text-sm text-gray-600 mt-3">
        Employee status is displayed from the backend, but there is no backend endpoint to update status yet.
      </p>
    </div>
  );
}