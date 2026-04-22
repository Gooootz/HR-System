import { Employee } from "./employee-cols";

export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch('http://localhost:5206/api/employeedata/get-all-employee-data');
    const data = await response.json();

    return data.map((employee: any) => ({
      id: employee.id,
      employeeId: employee.employeeId,
      fullname: employee.employeeName,
      jobTitle: employee.position,
      office: "", // Not provided in API response
      department: employee.department,
      status: employee.status.charAt(0).toUpperCase() + employee.status.slice(1), // Capitalize first letter
      email: "", // Not provided in API response
      phoneNo: "", // Not provided in API response
      avatar: "", // Not provided in API response
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}
