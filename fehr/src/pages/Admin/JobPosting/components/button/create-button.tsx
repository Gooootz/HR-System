import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate("/admin/create-job-posting")}
      >
        <Plus size={18} className="mr-1" />
        Create Job Posting
      </Button>
    </>
  );
};

export default CreateButton;
