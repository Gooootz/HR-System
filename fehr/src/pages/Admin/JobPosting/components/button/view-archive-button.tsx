import { Button } from "@/components/ui/button";
import { ArchiveIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewArchiveButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => navigate("/admin/archived-job-postings")}
      >
        <ArchiveIcon size={18} className="mr-1" />
        View Archive
      </Button>
    </>
  );
};

export default ViewArchiveButton;
