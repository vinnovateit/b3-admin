"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function TeamDetails({ teamId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editMembers, setEditMembers] = useState([]);

  useEffect(() => {
    if (!teamId) return setLoading(false);
    async function getData() {
      try {
        const [teamRes, usersRes] = await Promise.all([
            fetch(`/api/teams/${teamId}`),
            fetch(`/api/users`)
        ]);
        const teamData = await teamRes.json();
        const usersData = await usersRes.json();
        
        setData(teamData);
        setEditMembers(teamData.vitStudents || []);
        // Ensure usersData is an array to prevent .map() crash
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    getData();

  }, [teamId]);

  const handleSave = async () => {
    try {
        await fetch(`/api/teams/${teamId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                track: data.track,
                members: editMembers
            })
        });
        setIsEditing(false);
        // Refresh data
        const res = await fetch(`/api/teams/${teamId}`);
        const ref = await res.json();
        setData(ref);
    } catch(e) { console.error(e); }
  };

  const handleRoundUpdate = async (newRound) => {
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round: newRound })
      });
      if (res.ok) {
        setData(prev => ({ ...prev, round: newRound }));
      } else {
        alert("Failed to update round");
      }
    } catch (error) {
      console.error("Failed to update round", error);
    }
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;
  if (!data) return <p className="text-white p-8">Team not found</p>;

  return (
    <div className="relative min-h-screen bg-black/50">
      
      <h1 className="text-white p-8 text-[20px] font-bold">TEAM DETAILS</h1>
      <div className="flex flex-col items-center pb-8 mt-12">
        <div className="flex flex-col rounded-[10px] w-226 h-auto bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
          <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-[32px] uppercase">{data.name}</h2>
                <h2 className="text-[20px] text-[#9A9A9A] pb-1">TRACK : {data.track}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Round Selector */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                    <span className="text-xs text-white/50 pl-3 pr-1 font-bold uppercase tracking-wider">Round</span>
                    {[1, 2, 3].map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRoundUpdate(r)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                (data.round || 1) === r
                                ? 'bg-emerald-500 text-white shadow-lg scale-105'
                                : 'text-white/30 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`px-4 py-2 rounded-full text-sm font-bold shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition ${isEditing ? 'bg-green-500 text-white' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}>
                    {isEditing ? 'Save Changes' : 'Edit Team'}
                </button>
              </div>
          </div>

          <table className="table-auto mt-6 w-full text-left">
            <thead>
              <tr className="border-b border-[#9A9A9A] text-white">
                <th className="pb-4 pl-2">#</th>
                <th className="pb-4">Member Name</th>
                <th className="pb-4">Registration No.</th>
                {isEditing && <th className="pb-4">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {(isEditing ? editMembers : (data.vitStudents || [])).map((student, index) => (
                <tr key={student._id || index} className="border-b border-white/5 last:border-0">
                  <td className="py-2 pl-2 text-white/70">{index + 1}</td>
                  <td className="py-2">
                    {isEditing ? (
                        <input className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white w-full" value={student.name} onChange={e => {
                            const newM = [...editMembers];
                            newM[index].name = e.target.value;
                            setEditMembers(newM);
                        }} />
                    ) : <span className="text-white">{student.name || "Atiksh"}</span>}
                  </td>
                  <td className="py-2">
                    {isEditing ? (
                        <input className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white w-full" value={student.regNo} onChange={e => {
                            const newM = [...editMembers];
                            newM[index].regNo = e.target.value;
                            setEditMembers(newM);
                        }} />
                    ) : <span className="text-white/80">{student.regNo || "atikshkaregno"}</span>}
                  </td>
                  {isEditing && (
                      <td className="py-2">
                          <button onClick={() => {
                              setEditMembers(editMembers.filter((_, i) => i !== index));
                          }} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                      </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {isEditing && (
              <button onClick={() => setEditMembers([...editMembers, { name: "", regNo: "" }])} className="mt-4 w-full py-2 border border-dashed border-white/30 text-white/50 hover:text-white hover:border-white rounded-lg transition">
                  + Add Member
              </button>
          )}

        </div>

        {/* Submission Links Section */}
        <div className="flex flex-col gap-4 mt-8 w-226">
          <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
            <h3 className="text[12.8px] font-medium self-start text-white">Figma Submission</h3>
            <div className="flex gap-2 w-full">
              <input readOnly value={data.figmaLink || "No Link"} className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none" />
              {data.figmaLink && <a href={data.figmaLink} target="_blank"><button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white">View</button></a>}
            </div>
          </div>
          <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
            <h3 className="text[12.8px] font-medium self-start text-white">GitHub Submission</h3>
            <div className="flex gap-2 w-full">
              <input readOnly value={data.githubLink || "No Link"} className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none" />
              {data.githubLink && <a href={data.githubLink} target="_blank"><button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white">View</button></a>}
            </div>
          </div>
          <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
            <h3 className="text[12.8px] font-medium self-start text-white">PPT Submission</h3>
            <div className="flex gap-2 w-full">
              <input readOnly value={data.pptLinks || "No Link"} className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none" />
              {data.pptLinks && <a href={data.pptLinks} target="_blank"><button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white">View</button></a>}
            </div>
          </div>
          <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4 w-full">
            <h3 className="text[12.8px] font-medium self-start text-white">Other Submission</h3>
            <div className="flex gap-2 w-full">
              <input readOnly value={data.otherLinks || "No Link"} className="flex-1 bg-black/20 rounded-md px-3 text-sm text-white/80 border border-white/10 outline-none" />
              {data.otherLinks && <a href={data.otherLinks} target="_blank"><button className="text-[14.4px] font-medium w-[80px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white">View</button></a>}
            </div>
          </div>
        </div>

        {/* B3 Users Section */}
        <div className="mt-8 flex flex-col rounded-[10px] w-226 bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-white/20 p-6">
            <h3 className="text-white text-[20px] font-bold mb-4 uppercase border-b border-white/10 pb-2">All Users (B3 Directory)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {(users || []).map((user, i) => (
                    <div key={user.id || i} className="bg-white/5 p-3 rounded flex flex-col">
                        <span className="text-white font-medium">{user.name || "Unknown"}</span>
                        <span className="text-white/50 text-sm">{user.regNo || "No ID"}</span>
                        <span className="text-emerald-400 text-xs mt-1">{user.teamName} ({user.teamCode})</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}