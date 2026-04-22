import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const QuickAccess = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col space-y-4">
        <Card
          onClick={() => navigate("/")}
          className="p-5 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition duration-300 ease-in-out cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white"></div>
            <div>
              <p className="text-md font-semibold text-blue-800"></p>
              <p className="text-sm text-gray-500"></p>
            </div>
          </div>
        </Card>
        <Card
          onClick={() => navigate("/")}
          className="p-5 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition duration-300 ease-in-out cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center text-white"></div>
            <div>
              <p className="text-md font-semibold text-green-800"></p>
              <p className="text-sm text-gray-500"></p>
            </div>
          </div>
        </Card>
        <Card
          onClick={() => navigate("/")}
          className="p-5 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition duration-300 ease-in-out cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center text-white"></div>
            <div>
              <p className="text-md font-semibold text-yellow-800"></p>
              <p className="text-sm text-gray-500"></p>
            </div>
          </div>
        </Card>
        <Card
          onClick={() => navigate("/")}
          className="p-5 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition duration-300 ease-in-out cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center text-white"></div>
            <div>
              <p className="text-md font-semibold text-purple-800"></p>
              <p className="text-sm text-gray-500"></p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default QuickAccess;
