export default function EmployeeTable({
  employees,
  deleteEmployee,
}) {
  return (
    <table className="w-full border bg-white text-black">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-3">ID</th>
          <th className="border p-3">PIS</th>
          <th className="border p-3">Name</th>
          <th className="border p-3">Email</th>
          <th className="border p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {employees.map((emp) => (
          <tr key={emp.emp_id}>
            <td className="border p-3">
              {emp.emp_id}
            </td>

            <td className="border p-3">
              {emp.pis_number}
            </td>

            <td className="border p-3">
              {emp.first_name} {emp.last_name}
            </td>

            <td className="border p-3">
              {emp.email}
            </td>

            <td className="border p-3">
              <button
                onClick={() =>
                  deleteEmployee(emp.emp_id)
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
  );
}