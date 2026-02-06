"use client";

import React, {useEffect, useState} from 'react';
import {formatLabel} from "../util/util";


const CircularProgress = ({ value, max, color = "text-green-500" }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="transform -rotate-90 w-full h-full">

        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-700"
        />

        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="absolute text-[10px] font-medium text-white">
        {value}/{max}
      </span>
    </div>
  );
};


export default function HackathonDashboard({onSelectTeam}) {
  const [data, setData] = useState(null);

  useEffect(() => {
        fetch(`/api/dashboard`)
            .then(res => res.json())
            .then(fetchedData => {
                setData(fetchedData);
            })
            .catch(err => console.error(err));
    }, []);

    if (!data) return <p>Loading...</p>;

  const { teamlist: teams, teamcount, subcount } = data;

  return (
    // CHANGE 1: Removed 'font-sans' to ensure it inherits the exact same font stack as TeamDetails
    <div className="flex min-h-screen bg-black/50 text-white overflow-hidden relative">

    <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20 pointer-events-none"></div>

    <main className="flex-1 p-8 overflow-y-auto relative z-10">
      <header className="mb-10">
        {/* CHANGE 2: Removed 'tracking-wide'. Kept uppercase to match the visual style of "TEAM DETAILS" text. */}
        <h1 className="text-[20px] font-bold uppercase">Dashboard</h1>
        <p className="text-[#9A9A9A] text-sm mt-1">Hackathon overview and submission status</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg p-6 flex flex-col justify-center h-32 relative">
           <h3 className="text-gray-300 text-sm mb-1 leading-tight uppercase">Number<br />of<br />Teams</h3>
           <span className="absolute right-8 top-1/2 -translate-y-1/2 text-5xl font-light text-white">{teamcount}</span>
        </div>

        <div className="bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg p-6 flex items-center justify-between h-32">
          <div className="flex flex-col">
            <span className="text-lg font-medium text-white mb-1">Round 1</span>
            <span className="text-[#9A9A9A] text-sm">Submissions</span>
          </div>
          <CircularProgress value={subcount} max={teamcount} color="text-green-500" />
        </div>
      </div>

        <section>
          {/* CHANGE 3: Changed text-sm to text-[16px] and removed tracking-wider to match TeamDetails headers */}
          <h2 className="text-[16px] font-bold text-white uppercase mb-4 pl-2">Team Submission Status</h2>

          <div className="w-full">

            {/* CHANGE 4: Complete Overhaul of Table Headers
                - Removed: text-xs, text-gray-400, uppercase, tracking-wider
                - Added: text-white, border-b border-[#9A9A9A] (Exact match to TeamDetails table)
            */}
            <div className="grid grid-cols-12 gap-4 px-6 pb-2 mb-2 text-white font-bold border-b border-[#9A9A9A]">
              <div className="col-span-1"></div>
              <div className="col-span-2">Code</div>
              <div className="col-span-3">Team Name</div>
              <div className="col-span-4 text-center">Round 1 Submission</div>
              <div className="col-span-2"></div>
            </div>

            <div className="space-y-4">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl rounded-lg hover:bg-white/20 transition-colors"
                >
                  {/* CHANGE 5: Removed 'font-medium' from these lines. TeamDetails uses standard weight. */}
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-2 text-white">{team.code}</div>
                  <div className="col-span-3 text-white">{team.name}</div>

                  <div className={`col-span-4 text-center ${(team.submitted ? "text-green-400" : "text-amber-500" )} text-sm tracking-wide`}>
                    {formatLabel(team.submitted.toString())}
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <button
                      className="text-[14.4px] font-medium w-[117.6px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)] text-white hover:bg-[rgba(12,172,79,0.70)] transition-all cursor-pointer flex items-center justify-center"
                      onClick={() => { onSelectTeam(team.id); }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}