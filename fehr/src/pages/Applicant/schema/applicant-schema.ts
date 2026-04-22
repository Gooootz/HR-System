import { z } from "zod";


// personal ifnfo
export const empFormPersonalInfoSchema = z.object({
  Fullname: z.string().min(1, "Full name is required"),
  EmployeeCode: z.string().min(1, "Employee ID is required"),
  JobTitle: z.string().min(1, "Job title is required"),
  Department: z.string().min(1, "Department is required"),
  Office: z.string().min(1, "Office is required"),
  DateHired: z
  .union([z.string(), z.date()])
  .refine((val) => !isNaN(Date.parse(val as string)), "Invalid date format")
  .transform((val) => new Date(val as string)),
  EmploymentStatus: z.string().min(1, "Employment status is required"),
  DOB: z
  .union([z.string(), z.date()])
  .refine((val) => !isNaN(Date.parse(val as string)), "Invalid date format")
  .transform((val) => new Date(val as string)),
  PlaceOfBirth: z.string().min(1, "Place of Birth is required"),
  CivilStatus: z.string().min(1, "Civil status is required"),
  HomeAddress: z.string().min(1, "Civil status is required"),
  PhoneNo: z.string().min(1, "Phone Number is required"),
  Email: z.string().min(1, "Email is required"),
  TelephoneNo: z.string().optional(),
  Spouse: z.string().optional(),
  SpouseDOB: z
  .union([z.string(), z.date()])
  .refine((val) => !isNaN(Date.parse(val as string)), "Invalid date format")
  .transform((val) => new Date(val as string))
  .optional(),
  NoofChildren: z.string().optional()
});


// educational background
export const educationEntrySchema = z.object({
  // Level: z.string(),
  SchoolAttended: z.string().optional().default(""),
  YearGraduated: z.string().optional().default(""),
  AwardsReceived: z.string().optional().default(""),
});

export const empFormEducationSchema = z.object({
  educationalBackground: z.array(educationEntrySchema),
});


//eligibilities
export const empFormEligSchema = z.object({
  Memberships: z.array(
    z.object({
      organizationName: z.string().min(1, "Organization name is required"),
    })
  ),
  Eligibilities: z.array(
    z.object({
      examAssessment: z.string().min(1, "Examination/Assessment is required"),
      certificateNo: z.string().min(1, "Certificate No. is required"),
      nttcNo: z.string().optional(),
      expiryDate: z.string().min(1, "Invalid date format (dd/mm/yyyy)"),
    })
  ),
  EmploymentHistory: z.array(
    z.object({
      position: z.string().min(1, "Position is required"),
      employer: z.string().min(1, "Employer is required"),
      startDate: z.string().min(1, "Invalid date format (dd/mm/yyyy)"),
      endDate: z.string().min(1, "Invalid date format (dd/mm/yyyy)"),
      type: z.string().min(1, "Type is required"),
    })
  ),
});

//docs upload


// export const fileUploadSchema = z.object(dynamicFileUploadSchema);

export type EmpPersonalInfoType = z.infer<typeof empFormPersonalInfoSchema>;
export type EmpEducationType = z.infer<typeof educationEntrySchema>;
export type EmpEligType = z.infer<typeof empFormEligSchema>;
// export type EmpFileUpload = z.infer<typeof fileUploadSchema>;