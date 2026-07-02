import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: "+ Add Employee", to: "/dashboard/employees", state: { openCreate: true } },
    { label: "+ Add Cadre", to: "/dashboard/cadres", state: { openCreate: true } },
    { label: "+ Add Designation", to: "/dashboard/designations", state: { openCreate: true } },
    { label: "+ Add Group", to: "/dashboard/groups", state: { openCreate: true } },
  ];

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 mb-4">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.to, { state: action.state })}
            className="bg-[#0F4C5C] text-white px-3 py-2 rounded text-sm"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}