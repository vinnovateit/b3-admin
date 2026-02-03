import { useEffect, useState} from "react";
export default function TeamDetails({ teamId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId)return;
    async function getData() {
      try {
        const res = await fetch(`/api/teams/${teamId}`)
        const ref = await res.json()
        console.log(ref)
        setData(ref);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    }

    getData();

  }, [teamId]);
  if (loading) return <p>Loading team...</p>
  if (!data) return <p>No team found</p>

  return (
    <div>
      <div>
        <p className="text-white rounded bg-black">{data.name}</p>
      </div>
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Reg No</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>
    </div>
  );
}