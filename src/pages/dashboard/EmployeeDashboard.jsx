import StatCard from "./StatCard";
import DirectorySearch from "./DirectorySearch";

export default function EmployeeDashboard({ data }) {
  const { counts, profile } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <StatCard label="Employees" value={counts.employees} />
        <StatCard label="Cadres" value={counts.cadres} />
        <StatCard label="Designations" value={counts.designations} />
        <StatCard label="Groups" value={counts.groups} />
      </div>

      {profile ? (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 mb-4">My Profile</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Name</p>
              <p className="text-[#073B4C] font-medium">
                {[profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(" ")}
              </p>
            </div>
            <div>
              <p className="text-gray-400">PIS Number</p>
              <p className="text-[#073B4C] font-medium">{profile.pis_number}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-[#073B4C] font-medium">{profile.email || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-[#073B4C] font-medium">{profile.status ? "Active" : "Inactive"}</p>
            </div>
            <div>
              <p className="text-gray-400">Cadre</p>
              <p className="text-[#073B4C] font-medium">{profile.cadre_name || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400">Designation</p>
              <p className="text-[#073B4C] font-medium">{profile.designation_name || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400">Internal Designation</p>
              <p className="text-[#073B4C] font-medium">{profile.internal_designation_name || "—"}</p>
            </div>
            <div>
              <p className="text-gray-400">Group</p>
              <p className="text-[#073B4C] font-medium">{profile.group_name || "—"}</p>
            </div>
          </div>
        </div>
      ) : null}

      <DirectorySearch />
    </div>
  );
}