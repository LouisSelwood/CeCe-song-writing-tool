import React from "react";
import { createRoot } from "react-dom/client";
import PopoutRenderer from "./PopoutRenderer";


// Read the window ID from the query string
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Create the React root
const container = document.getElementById("root");
const root = createRoot(container);

// Render the popout renderer
root.render(
  <PopoutRenderer id={id} />
);
