import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import Digest_Token from "./auth.ext/Digest_Token";
import Dashboard from "./pages/Admin/Dashboard/page";
import EmployeeManagement from "./pages/Admin/EmployeeManagement/page";
import LeaveManagement from "./pages/Admin/LeaveManagement/page";
import PersonalInformation from "./pages/Admin/EmployeeManagement/components/pages/forms/personal-information";
import EducationalBackground from "./pages/Admin/EmployeeManagement/components/pages/forms/educational-background";
import Eligibilities from "./pages/Admin/EmployeeManagement/components/pages/forms/eligibilities";
import EmployeeDocuments from "./pages/Admin/EmployeeManagement/components/pages/forms/employee-documents";
import AttendanceMonitoring from "./pages/Admin/Attendance/page";
import LeaveCalendar from "./pages/Admin/LeaveManagement/components/leave-calendar";
import Onboarding from "./pages/Admin/Onboarding/page";
import ApplicantTracking from "./pages/Admin/ApplicantTracking/page";
import ApplicantInfo from "./pages/Admin/ApplicantTracking/pages/applicant-info";
import OnboardApplicantInfo from "./pages/Admin/Onboarding/pages/onboard-applicant-info";
import MainLayout from "./layout/main-layout";
import ApplicationLayout from "./layout/application-layout";
import ApplicationStart from "./pages/Applicant/page";
import { ApplicantPersonalInformation } from "./pages/Applicant/pages/forms/personal-information";
// import { ApplicantEducationalBackground } from "./pages/Applicant/pages/forms/educational-background";
// import { ApplicantEligibilities } from "./pages/Applicant/pages/forms/eligibilities";
import { ApplicantEmployeeDocuments } from "./pages/Applicant/pages/forms/applicant-documents";
import ApplicationSubmitted from "./pages/Applicant/pages/application-submit";
import DailyTimeRecords from "./pages/Admin/DTR/page";
import DTRManagement from "./pages/Admin/DTRManagement/page";
import SchoolCalendar from "./pages/Admin/SchoolCalendar/page";
import NotFound from "./pages/NotFound";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import JobPosting from "./pages/Admin/JobPosting/page";
import JobPostingInfo from "./pages/Admin/JobPosting/pages/view-job-posting";
import CreateJobPosting from "./pages/Admin/JobPosting/pages/create-job-posting";
import Disclaimer from "./pages/Applicant/pages/disclaimer";
import JobVacancies from "./pages/Applicant/pages/job-vacancies";
import ArchivedJobPosting from "./pages/Admin/JobPosting/pages/archived-job-postings";
import PayrollCalendarPage from "./pages/Admin/PayrollCalendar/page";
import Payroll from "./pages/Payroll/page";
import RankingMatrixPage from "./pages/Admin/RankingMatrix/page";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      role="alert"
      className="w-full p-4 bg-red-100 border border-red-400 text-red-700"
    >
      <h2 className="text-xl font-bold">Something went wrong:</h2>
      <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
      <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <SidebarProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route
                  index
                  element={<Navigate to="admin/dashboard" replace />}
                />
                <Route path="admin/dashboard" element={<Dashboard />} />
                <Route
                  path="admin/employee-management"
                  element={<EmployeeManagement />}
                />
                <Route
                  path="admin/attendance-monitoring"
                  element={<AttendanceMonitoring />}
                />
                <Route
                  path="admin/leave-management"
                  element={<LeaveManagement />}
                />
                <Route path="admin/onboarding" element={<Onboarding />} />
                <Route
                  path="admin/onboarding-applicant/:id"
                  element={<OnboardApplicantInfo />}
                />
                <Route
                  path="admin/dtr-management"
                  element={<DTRManagement />}
                />
                <Route
                  path="admin/school-calendar"
                  element={<SchoolCalendar />}
                />
                <Route
                  path="admin/applicant-tracking"
                  element={<ApplicantTracking />}
                />
                <Route
                  path="admin/applicant-info/:id"
                  element={<ApplicantInfo />}
                />
                <Route
                  path="admin/leave-calendar"
                  element={<LeaveCalendar />}
                />
                <Route path="admin/job-posting" element={<JobPosting />} />
                <Route
                  path="admin/job-posting-info/:id"
                  element={<JobPostingInfo />}
                />
                <Route
                  path="admin/create-job-posting"
                  element={<CreateJobPosting />}
                />
                <Route
                  path="admin/archived-job-postings"
                  element={<ArchivedJobPosting />}
                />

                {/* Create Employee Routes */}
                <Route
                  path="admin/create-employee/personal-information"
                  element={<PersonalInformation />}
                />
                <Route
                  path="admin/create-employee/educational-background"
                  element={<EducationalBackground />}
                />
                <Route
                  path="admin/create-employee/eligibilities"
                  element={<Eligibilities />}
                />
                <Route
                  path="admin/create-employee/employee-documents"
                  element={<EmployeeDocuments />}
                />
                <Route
                  path="admin/daily-time-records"
                  element={<DailyTimeRecords />}
                />
                <Route
                  path="admin/payroll-calendar"
                  element={<PayrollCalendarPage />}
                />
                <Route
                  path="admin/payroll"
                  element={<Payroll />}
                />
                <Route
                  path="admin/matrix"
                  element={<RankingMatrixPage />}
                />
              </Route>

              <Route path="application/*" element={<ApplicationLayout />}>
                <Route index element={<ApplicationStart />} />
                <Route path="disclaimer" element={<Disclaimer />} />
                <Route
                  path="personal-information"
                  element={<ApplicantPersonalInformation />}
                />
                {/* <Route
                  path="educational-background"
                  element={<ApplicantEducationalBackground />}
                />
                <Route
                  path="eligibilities"
                  element={<ApplicantEligibilities />}
                /> */}
                <Route
                  path="applicant-documents"
                  element={<ApplicantEmployeeDocuments />}
                />
                <Route path="job-vacancies" element={<JobVacancies />} />
                <Route path="submitted" element={<ApplicationSubmitted />} />
              </Route>
              {/* Authentication Route */}
              <Route path="/auth/:value" element={<Digest_Token />} />
              {/* Catch-all Route for 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </SidebarProvider>
      </Router>
    </>
  );
};

export default App;
