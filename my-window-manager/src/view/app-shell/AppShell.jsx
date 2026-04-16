import "./css/AppShell.css";
import { Desktop } from "./Desktop.jsx";
import { useState, useEffect } from "react";
import { ProjectBar } from "../windows/project-bar/ProjectBar.jsx";

/**
 * Top-level layout wrapper for the desktop enviroment
 * Responsible for base structural framing (Project bar + Desktop)
 * Passes store down to children
 */
export function AppShell({ store }) {

  return (
    
    <div className="app-shell">
      <ProjectBar store={store}/>
      <Desktop store={store} />

    </div>
  );
}