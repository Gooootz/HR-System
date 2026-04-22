// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const levels = [
//   "Elementary",
//   "Secondary",
//   "TVL Courses",
//   "Tertiary",
//   "Graduate",
//   "Post Graduate",
// ];

// export const ApplicantEducationalBackground = () => {
//   const navigate = useNavigate();
//   const [tvlCourses, setTvlCourses] = useState([
//     { course: "", year: "", awards: "" },
//   ]);

//   const addTvlRow = () => {
//     setTvlCourses([...tvlCourses, { course: "", year: "", awards: "" }]);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-full">
//       <Card className="p-4 w-full">
//         <CardHeader>
//           <CardTitle>Educational Background</CardTitle>
//           <CardDescription>Some description ...</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Card className="p-0 rounded-sm shadow-sm">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-1/4">Level</TableHead>
//                   <TableHead className="w-1/3">
//                     Course/ Schools Attended
//                   </TableHead>
//                   <TableHead className="w-1/6">Year Graduated</TableHead>
//                   <TableHead className="w-1/4">
//                     Awards/Citations Received
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {levels.map((level, index) =>
//                   level !== "TVL Courses" ? (
//                     <TableRow key={index}>
//                       <TableCell className="font-medium">{level}</TableCell>
//                       <TableCell>
//                         <Input placeholder="Enter school name" />
//                       </TableCell>
//                       <TableCell>
//                         <Input type="number" placeholder="YYYY" />
//                       </TableCell>
//                       <TableCell>
//                         <Input placeholder="Enter awards (if any)" />
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     tvlCourses.map((_, i) => (
//                       <TableRow key={`tvl-${i}`}>
//                         <TableCell className="font-medium">
//                           {i === 0 ? "TVL Courses" : ""}
//                         </TableCell>
//                         <TableCell>
//                           <Input placeholder="Enter course/school" />
//                         </TableCell>
//                         <TableCell>
//                           <Input type="number" placeholder="YYYY" />
//                         </TableCell>
//                         <TableCell>
//                           <Input placeholder="Enter awards (if any)" />
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )
//                 )}
//               </TableBody>
//             </Table>
//           </Card>

//           {/* Add TVL Course Row */}
//           <div className="flex justify-start mt-2">
//             <Button onClick={addTvlRow} variant="outline">
//               + Add TVL Course
//             </Button>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant={"outline"} onClick={() => navigate(-1)}>
//               Back
//             </Button>
//             <Button onClick={() => navigate("/application/eligibilities")}>
//               Next
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
