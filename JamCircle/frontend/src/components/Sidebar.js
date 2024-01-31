import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { SidebarData } from "./SidebarData";

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <div className="Brand">Jam Circle</div>
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className="row"
              // eslint-disable-next-line eqeqeq
              id={window.location.pathname == val.link ? "active" : ""} // checks if active page
              onClick={() => {
                window.location.pathname = val.link; // goes to clicked page
              }}
            >
              <div>{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
