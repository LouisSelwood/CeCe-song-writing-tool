import "./popout.css"
import React from "react";
import {WindowContent} from "../app-shell/WindowContent";
import {useSharedStore} from "./useSharedStore";

export default function PopoutRenderer({ id }) {

    const store = useSharedStore();
    return (
    <div className="popout-root">
      <WindowContent store={store} id={id} />
    </div>
  );
}