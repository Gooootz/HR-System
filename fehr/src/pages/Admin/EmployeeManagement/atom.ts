import { atomWithStorage } from 'jotai/utils'
import { EmpEducationType, EmpFileUpload, EmpPersonalInfoType, EmpEligType } from "./schema/employee-schema";

export const employeePersonalInfoAtom = atomWithStorage<EmpPersonalInfoType | null>('personalinfo', null);

export const empEducationAtom = atomWithStorage<EmpEducationType | null>('education', null)
export const empEligibilityAtom = atomWithStorage<EmpEligType | null>('eligibilities', null)
export const empDocumentAtom = atomWithStorage<EmpFileUpload | null>('documents', null)