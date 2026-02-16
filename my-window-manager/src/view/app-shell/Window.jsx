// Window.jsx
export function Window({ store, win }) {
  const style = {
    left: win.x,
    top: win.y,
    width: win.width,
    height: win.height,
    position: "absolute",
    backgroundColor: "#242424"
  };

  return (
    <div
      className="window"
      style={style}
      onMouseDown={() => store.actions.focusWindow(win.id)}
    >
      <div className="title-bar">
      </div>

      <div className="content">
        {/* render window content here */}
      </div>
    </div>
  );
}