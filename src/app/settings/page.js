import { useState } from "react";

export default function Settings() {
  const [form, setForm] = useState({name:"", email:"", regno:""})
  const handleChange = (e) => {
    if(!e.target.name) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = JSON.stringify(form)
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    if(res.ok){
      console.log("Admin added successfully")
      console.log(data)
    }
    else{
      console.log("Failed to add admin")
    }
  }
  return (
    <div className="relative min-h-screen bg-black/50">
      <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20"></div>
      <h1 className="text-white p-8 text-[20px] font-bold">SETTINGS</h1>
      <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="mt-20 w-150.5 h-auto flex flex-col justify-center rounded-[25px] bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-8 gap-6">
      <h1 className="text-[24px] pt-6">ADD NEW ADMIN</h1>
      <label className="text-[20px] pl-3">Name</label>
      <input name="name" className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] self-center p-4" type="text" placeholder="Enter Name" onChange={handleChange} value={form.name}></input>
      <label className="text-[20px] pl-3">Email Address</label>
      <input name="email" className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] self-center p-4" type="email" placeholder="Enter Email Address" onChange={handleChange} value={form.email}></input>
      <label className="text-[20px] pl-3">Registration Number</label>
      <input name="regno" className="rounded-[15px] bg-[#D9D9D9]/30 w-129 h-12 text-[15px] self-center p-4" type="text" placeholder="Enter Name" onChange={handleChange} value={form.regno}></input>
      <button className="bg-[#0CAC4F]/50 rounded-[25px] w-48 h-11.25 self-center mt-4" type="submit">ADD ADMIN</button>
      </form>
      </div>
    </div>
  );
}
