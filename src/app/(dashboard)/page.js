"use client";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#073B4C] mb-6">
        DRDO Employee Management System
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Employees
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            --
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Cadres
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            --
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Designations
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            --
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500">
            Groups
          </h3>

          <p className="text-3xl font-bold text-[#073B4C]">
            --
          </p>
        </div>
      </div>
    </div>
  );
}