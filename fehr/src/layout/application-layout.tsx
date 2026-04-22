import { ApplicationNav } from "@/pages/Applicant/components/navbar";
import arcImage from "@/assets/arc.png";
import { Outlet } from "react-router-dom";

const ApplicationLayout = () => {
  return (
    <div className="w-screen h-screen">
      <div className="flex flex-col h-full bg-gray-100">
        <ApplicationNav />
        <section
          className="relative flex flex-col items-center justify-center flex-1 bg-gray-100 p-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${arcImage})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApplicationLayout;
