"use client";


import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

const emptyFormData = {
  emp_id: "",
  group_id: "",
  username: "",
  password: "",
  user_type: "",
};

export default function AdminPage() {
  const [admins,setAdmins]=useState([]);
  const [groups,setGroups]=useState([]);
  const [employees,setEmployees]=useState([]);
  const [error,setError]=useState("");
  const [formData,setFormData]=useState(emptyFormData);

  function getStoredUser(){try{return JSON.parse(localStorage.getItem("authUser")||"null")}catch{return null}}
  const isAdmin=getStoredUser()?.role==="admin";
  const logout=()=>{localStorage.removeItem("authToken");localStorage.removeItem("authUser");window.location.href="/";};

  const load=async(url,setter)=>{
    const r=await apiFetch(url);
    if(r.status===401){logout();return;}
    const d=await r.json();
    if(!r.ok) throw new Error(d.error||"Load failed");
    setter(Array.isArray(d)?d:[]);
  };

  useEffect(()=>{load("/admins",setAdmins).catch(e=>setError(e.message));load("/groups",setGroups).catch(()=>{});load("/employees",setEmployees).catch(()=>{});},[]);

  const submit=async(e)=>{
    e.preventDefault();
    const r=await apiFetch("/admins",{method:"POST",body:JSON.stringify({
      emp_id:Number(formData.emp_id),
      group_id:Number(formData.group_id),
      username:formData.username,
      password:formData.password,
      user_type:formData.user_type
    })});
    if(r.status===401){logout();return;}
    const d=await r.json();
    if(!r.ok){setError(d.error||"Failed");return;}
    setFormData(emptyFormData);
    load("/admins",setAdmins);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#073B4C]">Admins</h1>
      {error && <p className="text-red-600">{error}</p>}
      {isAdmin && <form onSubmit={submit} className="grid grid-cols-3 gap-3 bg-white p-5 rounded shadow mb-6">
        <select className="border p-2" value={formData.emp_id} onChange={e=>setFormData({...formData,emp_id:e.target.value})}>
          <option value="">Select Employee</option>
          {employees.map(e=><option key={e.emp_id} value={e.emp_id}>{e.first_name} {e.last_name}</option>)}
        </select>
        <select className="border p-2" value={formData.group_id} onChange={e=>setFormData({...formData,group_id:e.target.value})}>
          <option value="">Select Group</option>
          {groups.map(g=><option key={g.group_id} value={g.group_id}>{g.full_name}</option>)}
        </select>
        <input className="border p-2" placeholder="Username" value={formData.username} onChange={e=>setFormData({...formData,username:e.target.value})}/>
        <input className="border p-2" type="password" placeholder="Password" value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})}/>
        <input className="border p-2" placeholder="User Type" value={formData.user_type} onChange={e=>setFormData({...formData,user_type:e.target.value})}/>
        <div className="col-span-3"><button className="bg-[#0F4C5C] text-white px-4 py-2 rounded">Add Admin</button></div>
      </form>}
      <table className="w-full bg-white border">
        <thead><tr><th>ID</th><th>Employee</th><th>Group</th><th>Username</th><th>User Type</th></tr></thead>
        <tbody>
        {admins.map(a=><tr key={a.admin_id}><td>{a.admin_id}</td><td>{a.employee_name||"-"}</td><td>{a.group_name||"-"}</td><td>{a.username}</td><td>{a.user_type}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
