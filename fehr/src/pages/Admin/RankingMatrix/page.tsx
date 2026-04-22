import { Card, CardContent } from "@/components/ui/card";
import MatrixTable from "./components/matrix-table";


const RankingMatrixPage = () => {
    return (
        <div>
            <Card>
                <CardContent>
                    <MatrixTable />
                </CardContent>
            </Card>
        </div>
    );
};

export default RankingMatrixPage;