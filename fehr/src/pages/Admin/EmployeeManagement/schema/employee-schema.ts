import { z } from "zod";
import { fileTypes } from "../components/pages/forms/employee-documents";

// personal info
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
  NoofChildren: z.string().optional(),
  Sex: z.string().min(1, "Sex is required")
});

// educational background
export const educationEntrySchema = z.object({
  Level: z.string().optional().default(""),
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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv"
];

const fileSchema = z
  .instanceof(FileList)
  .optional()
  .refine((v) => !v || v.length === 0 || v[0].size < MAX_FILE_SIZE, {
    message: `File size must be less than 5MB`,
  })
  .refine((v) => !v || v.length === 0 || ACCEPTED_FILE_TYPES.includes(v[0].type), {
    message: "Invalid file type. Please upload a valid document (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV) or image (JPG, PNG, WEBP)",
  });

const dynamicFileUploadSchema = fileTypes.reduce((schema: { [key: string]: any }, fileType) => {
  schema[fileType.name] = fileSchema;
  return schema;
}, {});

export const fileUploadSchema = z.object(dynamicFileUploadSchema);

export type EmpPersonalInfoType = z.infer<typeof empFormPersonalInfoSchema>;
export type EmpEducationType = z.infer<typeof empFormEducationSchema>;
export type EmpEligType = z.infer<typeof empFormEligSchema>;
export type EmpFileUpload = z.infer<typeof fileUploadSchema>;