import "./SongEditor.css"
import {useEffect, useState} from "react"
export function SongView({ store }) {
    useEffect(() => {
        console.log("song loaded")
    },[])
    return (
        <div style={{display: "flex", justifyContents: "center", alighItems: "center", color: "white", fontSize: 20, width: "100000px"}}>
            song
        </div>
    );
}