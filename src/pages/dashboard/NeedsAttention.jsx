export default function NeedsAttention({ items, onGoToEmployees }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500">Needs Attention</h3>
        {items.length > 0 ? (
          <button onClick={onGoToEmployees} className="text-sm text-[#0F4C5C] underline">
            View all in Employees
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">All employee records are complete.</p>
      ) : (
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.emp_id} className="py-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#073B4C]">
                  {item.name || item.pis_number || `Employee #${item.emp_id}`}
                </p>
                <p className="text-xs text-gray-500">Missing: {item.missing.join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}