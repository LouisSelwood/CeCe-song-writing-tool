import React from "react";
import { createRoot } from "react-dom/client";
import PopoutRenderer from "./PopoutRenderer";
console.log("Root element:", document.getElementById("root"));


// 1. Read the window ID from the query string
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 2. Create the React root
const container = document.getElementById("root");
const root = createRoot(container);

// 3. Render the popout renderer
root.render(
  <PopoutRenderer id={id} />
);
