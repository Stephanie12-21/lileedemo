"use client";
import NavBar from "./SubHeader/NavBar";

import { React } from "react";

const Header = () => {
  return (
    <div className="bg-[#15213D]">
      <div>
        <div className="h-[88px] ">
          <NavBar />
        </div>
      </div>
    </div>
  );
};

export default Header;
