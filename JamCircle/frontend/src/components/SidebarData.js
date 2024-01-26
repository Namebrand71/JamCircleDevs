import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";

export const SidebarData = [
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/home",
  },
  {
    title: "Profile",
    icon: <PersonIcon />,
    link: "/profile",
  },
  {
    title: "Friends",
    icon: <GroupIcon />,
    link: "/friends",
  },
];
