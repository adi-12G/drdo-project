import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function InternalDesignationsPage() {
	const [internalDesignations, setInternalDesignations] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		sname: "",
		full_name: "",
	});
	const [error, setError] = useState("");
const fetchInternalDesignations = async () => {
		try {
			const res = await apiFetch("/internal-designations");
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to load internal designations");
			}

			setInternalDesignations(Array.isArray(data) ? data : []);
			setError("");
		} catch (fetchError) {
			setInternalDesignations([]);
			setError(fetchError.message || "Failed to load internal designations");
		}
	};

	useEffect(() => {
		fetchInternalDesignations();
	}, []);

	const handleSubmit = async (e) => {
	e.preventDefault();

	try {
		let res;

		if (editingId) {
			res = await apiFetch(`/internal-designations/${editingId}`, {
				method: "PUT",
				body: JSON.stringify(formData),
			});
		} else {
			res = await apiFetch("/internal-designations", {
				method: "POST",
				body: JSON.stringify(formData),
			});
		}

		const data = await res.json();

		if (!res.ok) {
			throw new Error(
				data.error ||
					(editingId
						? "Failed to update internal designation"
						: "Failed to create internal designation")
			);
		}

		setFormData({
			sname: "",
			full_name: "",
		});

		setEditingId(null);
		fetchInternalDesignations();
	} catch (submitError) {
		setError(
			submitError.message ||
				(editingId
					? "Failed to update internal designation"
					: "Failed to create internal designation")
		);
	}
};

const editInternalDesignation = (item) => {
    setEditingId(item.internal_designation_id);

    setFormData({
        sname: item.sname,
        full_name: item.full_name,
    });
};

	const deleteInternalDesignation = async (id) => {
			if (!window.confirm("Delete this internal designation   ? This cannot be undone.")) {
				return;
			}

		try {
			const res = await apiFetch(`/internal-designations/${id}`, { method: "DELETE" });
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Failed to delete internal designation");
			}

			fetchInternalDesignations();
		} catch (deleteError) {
			setError(deleteError.message || "Failed to delete internal designation  ");
		}
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6 text-[#073B4C]">Internal Designations </h1>

			{error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

			<form
				onSubmit={handleSubmit}
				className="bg-white p-5 rounded shadow mb-6 grid grid-cols-3 gap-3"
			>
				<input
					type="text"
					placeholder="Short Name"
					className="border p-2 text-[#073B4C]"
					value={formData.sname}
					onChange={(e) => setFormData({ ...formData, sname: e.target.value })}
				/>

				<input
					type="text"
					placeholder="Full Name"
					className="border p-2 text-[#073B4C] col-span-2"
					value={formData.full_name}
					onChange={(e) =>
						setFormData({ ...formData, full_name: e.target.value })
					}
				/>

				<div className="col-span-3">
					<button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">
	{editingId
		? "Update Internal Designation"
		: "Add Internal Designation"}
</button>
				</div>
			</form>

			<table className="w-full bg-white border">
				<thead className="bg-gray-200">
					<tr>
						<th className="border p-3 text-[#073B4C]">ID</th>
						<th className="border p-3 text-[#073B4C]">Short Name</th>
						<th className="border p-3 text-[#073B4C]">Full Name</th>
						<th className="border p-3 text-[#073B4C]">Actions</th>
					</tr>
				</thead>

				<tbody>
  {internalDesignations.map((internalDesignation) => (
    <tr key={internalDesignation.internal_designation_id}>
      <td className="border p-3 text-[#073B4C]">
        {internalDesignation.internal_designation_id}
      </td>
      <td className="border p-3 text-[#073B4C]">
        {internalDesignation.sname}
      </td>
      <td className="border p-3 text-[#073B4C]">
        {internalDesignation.full_name}
      </td>
      <td className="border p-3 text-[#073B4C]">
       <div className="flex gap-2">
	<button
		type="button"
		onClick={() => editInternalDesignation(internalDesignation)}
		className="bg-blue-600 text-white px-3 py-1 rounded"
	>
		Edit
	</button>

	<button
		type="button"
		onClick={() =>
			deleteInternalDesignation(
				internalDesignation.internal_designation_id
			)
		}
		className="bg-red-600 text-white px-3 py-1 rounded"
	>
		Delete
	</button>
</div>
      </td>
    </tr>
  ))}
</tbody>
</table>

<p className="text-sm text-gray-600 mt-3">
  This page supports list, create, and delete for internal designations.
</p>
</div>
);
}
