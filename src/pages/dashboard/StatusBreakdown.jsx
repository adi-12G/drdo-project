export default function StatusBreakdown({ active, inactive }) {
  const total = active + inactive || 1;
  const activePct = Math.round((active / total) * 100);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-gray-500 mb-4">Employee Status</h3>

      <div className="w-full h-4 rounded overflow-hidden flex bg-gray-100">
        <div className="bg-green-500 h-full" style={{ width: `${activePct}%` }} />
        <div className="bg-red-400 h-full" style={{ width: `${100 - activePct}%` }} />
      </div>

      <div className="flex justify-between mt-3 text-sm">
        <span className="flex items-center gap-2 text-[#073B4C]">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Active ({active})
        </span>
        <span className="flex items-center gap-2 text-[#073B4C]">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Inactive ({inactive})
        </span>
      </div>
    </div>
  );
}