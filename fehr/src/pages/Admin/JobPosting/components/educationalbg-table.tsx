import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const educationData = [
  {
    level: "Elementary",
    school: "Sunrise Elementary School",
    yearGraduated: "2010",
    awards: "Best in Math",
  },
  {
    level: "High School",
    school: "Greenfield High School",
    yearGraduated: "2014",
    awards: "With Honors",
  },
  {
    level: "Senior High",
    school: "Blue Ridge Senior High",
    yearGraduated: "2016",
    awards: "Dean’s Lister",
  },
  {
    level: "College",
    school: "State University",
    yearGraduated: "2020",
    awards: "Cum Laude",
  },
  {
    level: "TVL Courses",
    school: "Technical Institute",
    yearGraduated: "2021",
    awards: "NC II Certification",
  },
];

const StaticEducationTable = () => {
  return (
    <Card className="p-0 rounded-sm shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Level</TableHead>
            <TableHead className="w-1/3">Course/ Schools Attended</TableHead>
            <TableHead className="w-1/6">Year Graduated</TableHead>
            <TableHead className="w-1/4">Awards/Citations Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {educationData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{entry.level}</TableCell>
              <TableCell>{entry.school}</TableCell>
              <TableCell>{entry.yearGraduated}</TableCell>
              <TableCell>{entry.awards}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default StaticEducationTable;
