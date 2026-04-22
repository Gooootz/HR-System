
import Navbar from "@/custom-components/navbar";
import { NewSideBar } from "@/custom-components/NewSidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {

  return (

    <div className="flex h-screen w-screen">
      <NewSideBar />
      <div className="flex flex-col w-full">
        <Navbar
          onLogout={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <main className="flex-1 overflow-auto bg-[#fbfbfb] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
