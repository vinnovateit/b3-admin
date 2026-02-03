'use client';

import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useParams} from "next/navigation";


const BackArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6"/>
  </svg>
);


const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', active: false },
    { name: 'Team Details', active: true },
    { name: 'Settings', active: false },
  ];

  return (
    <aside className="w-64 bg-[#054d33] flex flex-col h-full text-white font-medium sticky top-0">
      <div className="flex-1 pt-12 flex flex-col gap-6">
        {menuItems.map((item) => (
          <div key={item.name} className="relative">
            {item.active ? (
              <div className="bg-[#111214] text-white py-4 pl-10 rounded-l-[30px] ml-4 relative z-10 cursor-pointer transition-all">
                {item.name}
              </div>
            ) : (
              <div className="text-gray-300 hover:text-white py-3 pl-14 cursor-pointer transition-colors">
                {item.name}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pb-10 pl-14 text-gray-300 hover:text-white cursor-pointer">
        Log Out
      </div>
    </aside>
  );
};


const RubricSection = ({ title, marksData, remarksData, handleChange, handleRemarksChange }) => {


  const keys = Object.keys(marksData);


  const formatLabel = (str: string) => {
      if (str === "UIUX") return "UI/UX";
      const result = str.replace(/([A-Z])/g, " $1");
      return result.charAt(0).toUpperCase() + result.slice(1);
  };


  const sectionTotal = keys.reduce((acc, key) => acc + (parseInt(marksData[key]) || 0), 0);

  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row gap-8">


        <div className="flex-1">
          <div className="flex justify-between border-b border-gray-700 pb-2 text-sm text-gray-300 font-medium px-4">
            <span>Parameter Name</span>
            <span>Marks</span>
          </div>
          <div className="flex flex-col">
            {keys.map((key) => (
              <div key={key} className="flex justify-between items-center text-gray-200 border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors px-4 py-4 cursor-pointer group">
                <label htmlFor={key} className="cursor-pointer flex-1">
                  {formatLabel(key)}
                </label>
                <input
                  type="number"
                  min="0" max="10" step="1"
                  id={key}
                  name={key}
                  value={marksData[key]}
                  onChange={handleChange}
                  className="bg-transparent text-white w-16 text-right font-mono focus:outline-none focus:border-b focus:border-green-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-80 flex flex-col gap-4 sticky top-0 h-fit">
          <div className="bg-white/10 rounded-lg p-1 h-32 relative group focus-within:ring-1 focus-within:ring-green-500/50 transition-all">
            <textarea
              id="remarks"
              name="remarks"
              value={remarksData}
              onChange={handleRemarksChange}
              placeholder="Add Remarks"
              className="w-full h-full bg-transparent text-gray-300 p-3 text-sm focus:outline-none resize-none placeholder-gray-500"
            />
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-white font-bold tracking-wide">TOTAL MARKS</span>
            <div className="bg-white/20 text-white px-6 py-1.5 rounded-full font-semibold min-w-[3rem] text-center">
              {sectionTotal}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function TeamDetailsPage() {

  const [data, setData] = useState<any>();

  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        setIsSubmitted(true)
        setTimeout(() => setIsSubmitted(false), 300);

        const response = await fetch(`/api/team_remarks/${team_id}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        const res = await response.json();
        console.log(res);



  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "remarks") setData((prev: any) => ({...prev, roundDetails: {...prev.roundDetails},
                [name]: value
        }))

        else setData((prev: any) => ({...prev, roundDetails: {...prev.roundDetails,
               [name]: value === "" ? 0 : Number(value)}
        }));
    };


    const { team_id } = useParams();



    useEffect(() => {
        fetch(`/api/team_remarks/${team_id}?regNo=ADMIN001`)
            .then(res => res.json())
            .then(fetchedData => {
                console.log(fetchedData);
                setData({... fetchedData, "regNo": "ADMIN001"});
            })
            .catch(err => console.error(err));
    }, [team_id]);

    if (!data) return <p>Loading...</p>;

    const { roundDetails: marks, remarks, teamName, track } = data;






  return (
    <div className="flex min-h-screen bg-[#111214] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-400 mb-6 cursor-pointer hover:text-white w-fit">
            <BackArrowIcon />
            <span className="uppercase tracking-wider text-sm font-semibold">Team Remarks</span>
          </div>
          <p className="text-gray-500 text-sm mb-2">Visible only to admins & reviewers</p>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl text-white mb-2 font-medium">{(teamName as string)}</h1>
              <p className="text-gray-400 text-lg">TRACK : {track}</p>
            </div>


            <button type="button" className="bg-[#054d33] hover:bg-[#076644] text-white px-8 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20">
              Round 1
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1c1d21] border border-gray-800 rounded-xl p-8 shadow-2xl relative mb-10">

          <RubricSection
            title="Rubrics"
            marksData={marks}
            remarksData={remarks}
            handleChange={handleChange}
            handleRemarksChange={handleChange}
          />

          <div className="flex justify-end border-t border-gray-800 pt-6">

            <input
              type="submit"
              value={(isSubmitted ? "Submitted!" : "Submit")}
              className="flex justify-center items-center bg-green-700 hover:bg-green-600 text-white text-lg w-38 py-3 rounded-lg font-semibold shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] cursor-pointer"
            />
          </div>

        </form>
      </main>
    </div>
  );
}