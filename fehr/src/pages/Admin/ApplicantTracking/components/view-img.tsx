import { Button } from "@/components/ui/button";
import { PhotoProvider, PhotoView } from "react-photo-view";

interface ViewImageProps {
  label: string;
  type: "bc" | "gm" | "form";
  data: { Id: string; DocumentType: string; BinaryData: string }[]; // Static data prop
}

const ViewImage = ({ label, type, data }: ViewImageProps) => {
  // Filter documents based on the provided type
  const document = data.filter((d) => d.DocumentType === type);

  return (
    <PhotoProvider>
      {document.length > 0 ? (
        document.map((item) => (
          <PhotoView
            key={item.Id}
            src={`data:image/png;base64,${item.BinaryData}`}
          >
            <Button variant="outline" size={"lg"}>
              {label}
            </Button>
          </PhotoView>
        ))
      ) : (
        <p className="text-sm text-gray-500">No document available</p>
      )}
    </PhotoProvider>
  );
};

export default ViewImage;
