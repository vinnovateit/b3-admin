import { useEffect, useState } from "react";
export default function TeamDetails({ teamId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    async function getData() {
      try {
        const res = await fetch(`/api/teams/${teamId}`)
        const ref = await res.json()
        console.log(ref)
        setData(ref);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getData();

  }, [teamId]);
  if (loading) return <p>Loading team...</p>
  if (!data) return <p>No team found</p>

  return (
    <div className="relative min-h-screen bg-black/50">
      <div className="absolute inset-0 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-20"></div>
      <h1 className="text-white p-8 text-[20px] font-bold">TEAM DETAILS</h1>
      <div className="flex flex-col items-center pb-8 mt-12">
        <div className="flex flex-col rounded-[10px] w-226 h-89.75 bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
          <h2 className="text-white text-[32px] uppercase">{data.name}</h2>
          <h2 className="text-[20px] text-[#9A9A9A] pb-1">TRACK : {data.track}</h2>
          <table className="table-auto mt-2">
            <thead>
              <tr className="border-b border-[#9A9A9A]">
                <th></th>
                <th className="pb-4">Member Name</th>
                <th className="pb-4">Registration No.</th>
              </tr>
            </thead>
            <tbody>
              {(data.VITStudents || []).map((student, index) => (
                <tr key={student._id || index}>
                  <td>{index + 1}</td>
                  <td>{student.name || "Atiksh"}</td>
                  <td>{student.regno || "atikshkaregno"}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
      <div className="flex justify-center">
      <div className="mx-auto inline-flex flex-row gap-4 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-8">
        <div className="items-center flex flex-col gap-2 mt-5">
          <h3 className="text-[16px] font-bold">ROUND 1 SUBMISSION</h3>
          <button className="text-[10.08px] font-medium w-[146.72px] h-[25.2px] rounded-[14px] bg-[rgba(12,172,79,0.50)]">ADD/VIEW REMARKS</button>
        </div>
        <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
              <h3 className="text[12.8px] font-medium">Figma Submission</h3>
              <a href={data.figmaLink}><button className="text-[14.4px] font-medium w-[117.6px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">View</button></a>
        </div>
        <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
              <h3 className="text[12.8px] font-medium">GitHub Submission</h3>
              <a href={data.githubLink}><button className="text-[14.4px] font-medium w-[117.6px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">View</button></a>
        </div>
        <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
              <h3 className="text[12.8px] font-medium">PPT Submission</h3>
              <a href={data.pptLinks}><button className="text-[14.4px] font-medium w-[117.6px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">View</button></a>
        </div>
        <div className="items-center flex flex-col gap-2 bg-[rgba(255,255,255,0.10)] rounded-lg backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl p-4">
              <h3 className="text[12.8px] font-medium">Other Submission</h3>
              <a href={data.otherLinks}><button className="text-[14.4px] font-medium w-[117.6px] h-[24.8px] rounded-[20px] bg-[rgba(12,172,79,0.50)] shadow-[0_3.2px_3.2px_0_rgba(0,0,0,0.25)]">View</button></a>
        </div>
      </div>
      </div>


    </div>
  );
}