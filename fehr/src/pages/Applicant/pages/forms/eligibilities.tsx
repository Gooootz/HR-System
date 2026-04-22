// import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
// import { Separator } from "@/components/ui/separator";
// import EmploymentSelect from "../../components/select/employmenttype-select";

// export const ApplicantEligibilities = () => {
//   const navigate = useNavigate();
//   const [eligibilities, setEligibilities] = useState([
//     { exam: "", certNo: "", nttcNo: "", expiry: "" },
//   ]);
//   const [membership, setMembership] = useState([{ details: "" }]);

//   const [employmentRecords, setEmploymentRecords] = useState([
//     {
//       position: "",
//       employer: "",
//       startDate: "",
//       endDate: "",
//       partTime: false,
//       fullTime: false,
//     },
//   ]);

//   const addEmploymentRow = () => {
//     setEmploymentRecords([
//       ...employmentRecords,
//       {
//         position: "",
//         employer: "",
//         startDate: "",
//         endDate: "",
//         partTime: false,
//         fullTime: false,
//       },
//     ]);
//   };

//   const addEligibilityRow = () => {
//     setEligibilities([
//       ...eligibilities,
//       { exam: "", certNo: "", nttcNo: "", expiry: "" },
//     ]);
//   };

//   const addMembershipRow = () => {
//     setMembership([...membership, { details: "" }]);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       {/* Eligibility Table */}
//       <Card className="p-4">
//         <CardHeader className="text-lg font-bold">
//           Membership in Professional Organizations
//         </CardHeader>
//         <CardContent>
//           {membership.map((_, i) => (
//             <div key={i} className="py-2">
//               <Input placeholder="Enter organization name" />
//             </div>
//           ))}

//           <div className="flex justify-start mt-4">
//             <Button onClick={addMembershipRow} variant="outline">
//               + Add Membership
//             </Button>
//           </div>
//         </CardContent>
//         <Separator />
//         <CardHeader className="text-lg font-bold">Eligibilities</CardHeader>
//         <CardContent>
//           <Card className="p-0 rounded-sm shadow-none">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-1/4">
//                     Examination/ Assessment
//                   </TableHead>
//                   <TableHead className="w-1/4">Certificate No.</TableHead>
//                   <TableHead className="w-1/4">NTTC No.</TableHead>
//                   <TableHead className="w-1/4">Expiry Date</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {eligibilities.map((_, i) => (
//                   <TableRow key={i}>
//                     <TableCell>
//                       <Input placeholder="Enter exam/assessment" />
//                     </TableCell>
//                     <TableCell>
//                       <Input placeholder="Enter certificate no." />
//                     </TableCell>
//                     <TableCell>
//                       <Input placeholder="Enter NTTC no." />
//                     </TableCell>
//                     <TableCell>
//                       <Input type="date" />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Card>

//           {/* Add Eligibility Row */}
//           <div className="flex justify-start mt-4">
//             <Button onClick={addEligibilityRow} variant="outline">
//               + Add Eligibility
//             </Button>
//           </div>
//         </CardContent>
//         <Separator />

//         <CardHeader className="text-lg font-bold">
//           Employment History
//         </CardHeader>
//         <CardContent>
//           <Card className="p-0 rounded-sm shadow-none">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-1/5">Position</TableHead>
//                   <TableHead className="w-1/4">Employer</TableHead>
//                   <TableHead className="w-1/4">Inclusive Dates</TableHead>
//                   <TableHead className="w-1/6">Type</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {employmentRecords.map((_, i) => (
//                   <TableRow key={i}>
//                     <TableCell>
//                       <Input placeholder="Enter position" />
//                     </TableCell>
//                     <TableCell>
//                       <Input placeholder="Enter employer" />
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex space-x-2">
//                         <Input type="date" className="w-1/2" />
//                         <Input type="date" className="w-1/2" />
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <EmploymentSelect />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Card>
//           {/* Add Employment Row */}
//           <div className="flex justify-start mt-4">
//             <Button onClick={addEmploymentRow} variant="outline">
//               + Add Employment
//             </Button>
//           </div>
//           <CardContent />

//           {/* Submit Button */}
//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant={"outline"} onClick={() => navigate(-1)}>
//               Back
//             </Button>
//             <Button
//               onClick={() => navigate("/application/applicant-documents")}
//             >
//               Next
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
