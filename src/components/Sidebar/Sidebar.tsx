import { ShapeComponents, ShapeType } from "../shape/types";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-label">Drag shapes to the canvas</div>
      <div className="sidebar-items">
        {Object.keys(ShapeComponents).map((type) => (
          <SidebarItem type={type as ShapeType} key={type} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
