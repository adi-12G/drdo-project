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

// <input type="date"> only understands ISO (YYYY-MM-DD), but the DB/API
// stores dob as DD-MM-YYYY. These helpers convert between the two.
function toInputDate(dbDate) {
  if (!dbDate) return "";

  // Already ISO (e.g. "1990-05-14" or a full timestamp)
  if (/^\d{4}-\d{2}-\d{2}/.test(dbDate)) {
    return dbDate.slice(0, 10);
  }

  // DD-MM-YYYY or DD/MM/YYYY
  const match = dbDate.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  return "";
}

const emptyCreateForm = {
  pis_number: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "",
  dob: "",
  mobile: "",
  tele_no: "",
  email: "",
  cadre_id: "",
  designation_id: "",
  internal_designation_id: "",
  group_id: "",
  user_type: "",
  username: "",
  password: "",
  is_gazetted: false,
};

const emptyEditForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  gender: "",
  dob: "",
  mobile: "",
  tele_no: "",
  email: "",
  cadre_id: "",
  designation_id: "",
  internal_designation_id: "",
  group_id: "",
  user_type: "",
  username: "",
  is_gazetted: false,
  new_password: "", // only sent if admin fills it in, kept separate from the rest of the edit payload
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
          middle_name: createForm.middle_name || null,
          gender: createForm.gender || null,
          dob: createForm.dob || null,
          mobile: createForm.mobile || null,
          tele_no: createForm.tele_no || null,
          cadre_id: createForm.cadre_id || null,
          designation_id: createForm.designation_id || null,
          internal_designation_id: createForm.internal_designation_id || null,
          group_id: createForm.group_id || null,
          user_type: createForm.user_type || null,
          // Default the username to the PIS number if the field was left blank.
          username: createForm.username || createForm.pis_number,
          // Sent as plain text as requested — no hashing/encryption applied here.
          password: createForm.password || null,
          is_gazetted: createForm.is_gazetted ? 1 : 0,
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
      middle_name: employee.middle_name || "",
      last_name: employee.last_name || "",
      gender: employee.gender || "",
      dob: toInputDate(employee.dob),
      mobile: employee.mobile || "",
      tele_no: employee.tele_no || "",
      email: employee.email || "",
      cadre_id: employee.cadre_id || "",
      designation_id: employee.designation_id || "",
      internal_designation_id: employee.internal_designation_id || "",
      group_id: employee.group_id || "",
      user_type: employee.user_type || "",
      username: employee.username || "",
      is_gazetted: !!employee.is_gazetted,
      new_password: "",
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
      const { new_password, ...editFields } = editForm;

      const res = await apiFetch(`/employees/${editingEmployeeId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editFields,
          middle_name: editForm.middle_name || null,
          gender: editForm.gender || null,
          dob: editForm.dob || null,
          mobile: editForm.mobile || null,
          tele_no: editForm.tele_no || null,
          cadre_id: editForm.cadre_id || null,
          designation_id: editForm.designation_id || null,
          internal_designation_id: editForm.internal_designation_id || null,
          group_id: editForm.group_id || null,
          user_type: editForm.user_type || null,
          username: editForm.username || null,
          is_gazetted: editForm.is_gazetted ? 1 : 0,
          // Only include the password field if the admin actually typed a new one.
          // Sent as plain text as requested — no hashing/encryption applied here.
          ...(new_password ? { password: new_password } : {}),
        }),
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
          (employee.email || "").toLowerCase().includes(term) ||
          (employee.username || "").toLowerCase().includes(term)
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
            placeholder="Middle Name"
            className="border p-2 text-black"
            value={createForm.middle_name}
            onChange={(e) =>
              setCreateForm({ ...createForm, middle_name: e.target.value })
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

          <select
            className="border p-2 text-black"
            value={createForm.gender}
            onChange={(e) =>
              setCreateForm({ ...createForm, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="flex flex-col text-xs text-gray-600">
            Date of Birth
            <input
              type="date"
              className="border p-2 text-black"
              value={createForm.dob}
              onChange={(e) =>
                setCreateForm({ ...createForm, dob: e.target.value })
              }
            />
          </label>

          <input
            type="tel"
            placeholder="Mobile"
            className="border p-2 text-black"
            value={createForm.mobile}
            onChange={(e) =>
              setCreateForm({ ...createForm, mobile: e.target.value })
            }
          />

          <input
            type="tel"
            placeholder="Telephone No."
            className="border p-2 text-black"
            value={createForm.tele_no}
            onChange={(e) =>
              setCreateForm({ ...createForm, tele_no: e.target.value })
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

          <select
            className="border p-2 text-black"
            value={createForm.user_type}
            onChange={(e) =>
              setCreateForm({ ...createForm, user_type: e.target.value })
            }
          >
            <option value="">Select User Type</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Username"
              className="border p-2 text-black flex-1"
              value={createForm.username}
              onChange={(e) =>
                setCreateForm({ ...createForm, username: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() =>
                setCreateForm({ ...createForm, username: createForm.pis_number })
              }
              className="bg-gray-200 text-black px-2 rounded text-sm whitespace-nowrap"
            >
              Use PIS
            </button>
          </div>

          <input
            type="password"
            placeholder="Password"
            className="border p-2 text-black"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm({ ...createForm, password: e.target.value })
            }
          />

          <label className="flex items-center gap-2 text-sm text-black">
            <input
              type="checkbox"
              checked={createForm.is_gazetted}
              onChange={(e) =>
                setCreateForm({ ...createForm, is_gazetted: e.target.checked })
              }
            />
            Gazetted
          </label>

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
            placeholder="Middle Name"
            className="border p-2 text-black"
            value={editForm.middle_name}
            onChange={(e) =>
              setEditForm({ ...editForm, middle_name: e.target.value })
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

          <select
            className="border p-2 text-black"
            value={editForm.gender}
            onChange={(e) =>
              setEditForm({ ...editForm, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="flex flex-col text-xs text-gray-600">
            Date of Birth
            <input
              type="date"
              className="border p-2 text-black"
              value={editForm.dob}
              onChange={(e) =>
                setEditForm({ ...editForm, dob: e.target.value })
              }
            />
          </label>

          <input
            type="tel"
            placeholder="Mobile"
            className="border p-2 text-black"
            value={editForm.mobile}
            onChange={(e) =>
              setEditForm({ ...editForm, mobile: e.target.value })
            }
          />

          <input
            type="tel"
            placeholder="Telephone No."
            className="border p-2 text-black"
            value={editForm.tele_no}
            onChange={(e) =>
              setEditForm({ ...editForm, tele_no: e.target.value })
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

          <select
            className="border p-2 text-black"
            value={editForm.cadre_id}
            onChange={(e) =>
              setEditForm({ ...editForm, cadre_id: e.target.value })
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
            value={editForm.designation_id}
            onChange={(e) =>
              setEditForm({ ...editForm, designation_id: e.target.value })
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
            value={editForm.internal_designation_id}
            onChange={(e) =>
              setEditForm({
                ...editForm,
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
            value={editForm.group_id}
            onChange={(e) =>
              setEditForm({ ...editForm, group_id: e.target.value })
            }
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.group_id} value={group.group_id}>
                {group.full_name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 text-black"
            value={editForm.user_type}
            onChange={(e) =>
              setEditForm({ ...editForm, user_type: e.target.value })
            }
          >
            <option value="">Select User Type</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <input
            type="text"
            placeholder="Username"
            className="border p-2 text-black"
            value={editForm.username}
            onChange={(e) =>
              setEditForm({ ...editForm, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="New Password (leave blank to keep current)"
            className="border p-2 text-black"
            value={editForm.new_password}
            onChange={(e) =>
              setEditForm({ ...editForm, new_password: e.target.value })
            }
          />

          <label className="flex items-center gap-2 text-sm text-black">
            <input
              type="checkbox"
              checked={editForm.is_gazetted}
              onChange={(e) =>
                setEditForm({ ...editForm, is_gazetted: e.target.checked })
              }
            />
            Gazetted
          </label>

          <div className="col-span-2 flex gap-2">
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
          placeholder="Search by name, PIS number, username, or email..."
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
            <th className="border p-2 text-[#073B4C]">Username</th>
            <th className="border p-2 text-[#073B4C]">User Type</th>
            <th className="border p-2 text-[#073B4C]">Email</th>
            <th className="border p-2 text-[#073B4C]">Mobile</th>
            <th className="border p-2 text-[#073B4C]">DOB</th>
            <th className="border p-2 text-[#073B4C]">Gazetted</th>
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
                {employee.first_name} {employee.middle_name} {employee.last_name}
              </td>
              <td className="border p-2 text-[#073B4C]">{employee.username}</td>
              <td className="border p-2 text-[#073B4C]">{employee.user_type}</td>
              <td className="border p-2 text-[#073B4C]">{employee.email}</td>
              <td className="border p-2 text-[#073B4C]">{employee.mobile}</td>
              <td className="border p-2 text-[#073B4C]">{employee.dob}</td>
              <td className="border p-2 text-[#073B4C]">
                {employee.is_gazetted ? "Yes" : "No"}
              </td>
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
              <td colSpan={isAdmin ? 11 : 10} className="border p-4 text-center text-gray-500">
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