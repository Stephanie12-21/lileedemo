import React from "react";
import { Separator } from "@/components/ui/separator";
import NavBar from "./SubHeader/NavBar";
import TopHeader from "./TopHeader/TopHeader";

const Header = () => {
  return (
    <div className="bg-[#15213D]">
      <TopHeader />
      <Separator />
      <div>
        <div className="h-[88px] ">
          <NavBar />
        </div>
      </div>
    </div>
  );
};

export default Header;
