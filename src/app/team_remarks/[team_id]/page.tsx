'use client'
import { useParams } from "next/navigation";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";

export default function TeamRemarks() {
    const [data, setData] = useState<any>();

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
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

    const { roundDetails: marks, remarks } = data;

    return (
        <>
            <h6>Team Remarks</h6>
            <p>Visible only to admins and reviewers</p>
            <h3>{data.teamName}</h3>
            <p>{data.track}</p>
            <p>Round {data.roundNum === "ONE" ? 1 : 2}</p>
            <div id="editor">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="TechStack">Tech Stack</label>
                    <input type="number" id="TechStack" name="TechStack" value={marks.TechStack} onChange={handleChange}/>
                    <label htmlFor="UIUX">UI/UX</label>
                    <input type="number" id="UIUX" name="UIUX" value={marks.UIUX} onChange={handleChange}/>
                    <label htmlFor="feasibility">Feasibility</label>
                    <input type="number" id="feasibility" name="feasibility" value={marks.feasibility} onChange={handleChange}/>
                    <label htmlFor="pitch">Pitch</label>
                    <input type="number" id="pitch" name="pitch" value={marks.pitch} onChange={handleChange}/>
                    <label htmlFor="problemClarity">Problem Clarity</label>
                    <input type="number" id="problemClarity" name="problemClarity" value={marks.problemClarity} onChange={handleChange}/>
                    <label htmlFor="remarks">Remarks</label>
                    <textarea id="remarks" name="remarks" value={remarks} onChange={handleChange}></textarea>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        </>
    );
}