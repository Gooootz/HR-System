import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GettingStarted = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/application/disclaimer");
  };
  return (
    <>
      <h1 className="text-5xl text-white font-extrabold font-heading mb-4 uppercase whitespace-nowrap">
        Welcome to Aldersgate College Inc
      </h1>
      <p className="mb-8 text-lg text-white text-center">
        We're excited that you're considering a career with us. Our application
        process is designed to be simple and straightforward.
      </p>
      <Button
        size={"lg"}
        onClick={handleStart}
        className="text-md bg-yellow-400 hover:bg-yellow-700 rounded-full text-white font-semibold transition-colors duration-300"
      >
        Get Started
      </Button>
    </>
  );
};

export default GettingStarted;
