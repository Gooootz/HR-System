import React, { useEffect, useState, useRef } from 'react';
import { FaSearch, FaFileExport, FaPrint, FaArrowUp, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface RateMatrix {
    id: string;
    schoolYear: string;
    date: string;
    code: string;
    description: string;
    type: string;
    rate: string;
    monthlySalary?: string;
    deductions?: {
        sss: string;
        pagibig: string;
        philhealth: string;
        totalDeductions: string;
        netSalary: string;
    };
}

interface SalaryMatrix {
    id: string;
    schoolYear: string;
    code: string;
    rank: string;
    admin: string;
    faculty: string;
    type: string;
    firstIncrement: string;
    firstRemarks: string;
    secondIncrement: string;
    secondRemarks: string;
    thirdIncrement: string;
    thirdRemarks: string;
    fourthIncrement: string;
    fourthRemarks: string;
    fifthIncrement: string;
    fifthRemarks: string;
    sixthIncrement: string;
    sixthRemarks: string;
    seventhIncrement: string;
    seventhRemarks: string;
    eighthIncrement: string;
    eighthRemarks: string;
    dateCreated: string;
    dateUpdated: string;
}

interface EvaluationCriteria {
    category: string;
    requirements: string[];
    status: 'met' | 'pending' | 'not-met';
}

interface EmployeeEvaluation {
    name: string;
    currentRank: string;
    nextRank: string;
    requirementsMet: string[];
    requirementsNeeded: string[];
    evaluationCriteria: EvaluationCriteria[];
    lastEvaluationDate: string;
    nextEvaluationDate: string;
    performanceScore: number;
    recommendations: string[];
    currentRate?: string;
    nextRate?: string;
    currentSalary?: string;
    nextSalary?: string;
    currentMonthlyRate?: string;
    nextMonthlyRate?: string;
    currentDeductions?: {
        sss: string;
        pagibig: string;
        philhealth: string;
        totalDeductions: string;
        netSalary: string;
    };
    nextDeductions?: {
        sss: string;
        pagibig: string;
        philhealth: string;
        totalDeductions: string;
        netSalary: string;
    };
}

interface Employee {
    id: string;
    employeeId: string;
    dtrId: string;
    employeeName: string;
    position: string;
    employeeCode: string;
    department: string;
    employeeType: 'full-time' | 'part-time' | 'dual-status';
    employmentType: string;
    status: string;
    onboardingDate: string;
}

interface RankStatus {
    currentRank: string;
    nextRank: string;
    requirementsMet: string[];
    requirementsNeeded: string[];
    currentRate?: string;
    nextRate?: string;
    employmentType?: string;
    currentMonthlyRate?: string;
    nextMonthlyRate?: string;
    currentSalary?: string;
    nextSalary?: string;
    currentDeductions?: {
        sss: string;
        pagibig: string;
        philhealth: string;
        totalDeductions: string;
        netSalary: string;
    };
    nextDeductions?: {
        sss: string;
        pagibig: string;
        philhealth: string;
        totalDeductions: string;
        netSalary: string;
    };
}

interface DualRankStatus {
    fullTime: RankStatus;
    partTime: RankStatus;
}

// Helper to determine current and next rank and relevant financial data for an employee
function getCurrentAndNextRank(employee: Employee, rateMatrix: RateMatrix[], salaryMatrix: SalaryMatrix[]): RankStatus {
    // Helper function to calculate deductions
    const calculateDeductions = (monthlySalary: number) => {
        // SSS: 4.5% of monthly salary (capped at 1,800)
        const sss = Math.min(monthlySalary * 0.045, 1800);

        // Pag-IBIG: 2% of monthly salary (capped at 100)
        const pagibig = Math.min(monthlySalary * 0.02, 100);

        // PhilHealth: 3% of monthly salary (capped at 1,800)
        const philhealth = Math.min(monthlySalary * 0.03, 1800);

        const totalDeductions = sss + pagibig + philhealth;
        const netSalary = monthlySalary - totalDeductions;

        return {
            sss: sss.toFixed(2),
            pagibig: pagibig.toFixed(2),
            philhealth: philhealth.toFixed(2),
            totalDeductions: totalDeductions.toFixed(2),
            netSalary: netSalary.toFixed(2)
        };
    };

    // Find the appropriate salary entry based on position
    const currentSalaryEntry = salaryMatrix.find(entry =>
        entry.faculty === employee.position || (entry.admin && entry.admin.includes(employee.position))
    );

    if (currentSalaryEntry) {
        // Calculate current salary based on position
        const currentSalary = currentSalaryEntry.firstIncrement;
        const nextSalaryEntry = salaryMatrix[salaryMatrix.findIndex(entry => entry.id === currentSalaryEntry.id) + 1] || null;
        const nextSalary = nextSalaryEntry ? nextSalaryEntry.firstIncrement : 'N/A';

        // Remove commas and convert to numbers for calculations
        const cleanedCurrentSalary = currentSalary === 'N/A' ? 0 : Number(currentSalary.replace(/,/g, ''));
        const cleanedNextSalary = nextSalary === 'N/A' ? 0 : Number(nextSalary.replace(/,/g, ''));

        // Calculate deductions for current and next salary
        const currentDeductions = calculateDeductions(cleanedCurrentSalary);
        const nextDeductions = calculateDeductions(cleanedNextSalary);

        return {
            currentRank: employee.position,
            nextRank: nextSalaryEntry ? (nextSalaryEntry.faculty || nextSalaryEntry.admin) : 'Highest Rank',
            requirementsMet: [],
            requirementsNeeded: nextSalaryEntry ? [nextSalaryEntry.faculty || nextSalaryEntry.admin || ''] : [],
            currentSalary: cleanedCurrentSalary.toString(),
            nextSalary: cleanedNextSalary.toString(),
            currentDeductions,
            nextDeductions
        };
    }

    return {
        currentRank: employee.position,
        nextRank: 'N/A',
        requirementsMet: [],
        requirementsNeeded: [],
        currentRate: 'N/A',
        nextRate: 'N/A',
    };
}

function isDualRankStatus(status: RankStatus | DualRankStatus): status is DualRankStatus {
    return 'fullTime' in status && 'partTime' in status;
}

function isSingleRankStatus(status: RankStatus | DualRankStatus): status is RankStatus {
    return !isDualRankStatus(status);
}

const MatrixTable = () => {
    const [rateMatrix, setRateMatrix] = useState<RateMatrix[]>([]);
    const [salaryMatrix, setSalaryMatrix] = useState<SalaryMatrix[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof RateMatrix; direction: 'asc' | 'desc' }>({
        key: 'code',
        direction: 'asc'
    });
    // New state variables for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<'all' | 'admin' | 'faculty'>('all');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeEvaluation | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showSalaryDetails, setShowSalaryDetails] = useState(false);
    const [visibleEmployeeCount, setVisibleEmployeeCount] = useState(8);
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rateResponse, salaryResponse, employeeResponse] = await Promise.all([
                    fetch('http://localhost:5206/api/ratematrix/get-rates'),
                    fetch('http://localhost:5206/api/salarymatrix/get-salary-scale'),
                    fetch('http://localhost:5206/api/employeedata/get-all-employee-data')
                ]);

                if (!rateResponse.ok || !salaryResponse.ok || !employeeResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const rateData = await rateResponse.json();
                const salaryData = await salaryResponse.json();
                const employeeData = await employeeResponse.json();

                setRateMatrix(rateData);
                setSalaryMatrix(salaryData);
                setEmployees(employeeData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (tableRef.current) {
                const { scrollTop } = tableRef.current;
                setShowBackToTop(scrollTop > 300);
            }
        };

        const currentRef = tableRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleBackToTop = () => {
        if (tableRef.current) {
            tableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleExport = () => {
        const table = document.querySelector('table');
        if (!table) return;

        const html = table.outerHTML;
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary-matrix.xls';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSort = (key: keyof RateMatrix) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedMatrix = [...rateMatrix].sort((a, b) => {
        if (sortConfig.key === 'rate') {
            return sortConfig.direction === 'asc'
                ? Number(a.rate) - Number(b.rate)
                : Number(b.rate) - Number(a.rate);
        }
        // Ensure we're only comparing string values
        const aValue = a[sortConfig.key]?.toString() || '';
        const bValue = b[sortConfig.key]?.toString() || '';
        return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    const filteredMatrix = sortedMatrix.filter(item => {
        const matchesSearch =
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'all' ||
            (filterCategory === 'admin' && item.type === 'admin') ||
            (filterCategory === 'faculty' && item.type === 'faculty');

        return matchesSearch && matchesCategory;
    });

    const handleEmployeeClick = (employee: Employee) => {
        const status = getCurrentAndNextRank(employee, rateMatrix, salaryMatrix);

        // Mock evaluation data - in a real app, this would come from an API
        const evaluation: EmployeeEvaluation = {
            name: employee.employeeName,
            currentRank: status.currentRank,
            nextRank: status.nextRank,
            requirementsMet: status.requirementsMet,
            requirementsNeeded: status.requirementsNeeded,
            evaluationCriteria: [
                {
                    category: "Education",
                    requirements: ["Bachelor's Degree"],
                    status: "met"
                },
                {
                    category: "Experience",
                    requirements: ["Minimum 3 years relevant experience"],
                    status: "pending"
                },
                {
                    category: "Professional Development",
                    requirements: ["Certifications", "Training"],
                    status: "not-met"
                }
            ],
            lastEvaluationDate: "2024-01-15",
            nextEvaluationDate: "2024-07-15",
            performanceScore: 85,
            recommendations: [
                "Review and update professional development plan",
                "Gain more relevant experience"
            ],
            currentSalary: status.currentSalary,
            nextSalary: status.nextSalary,
            currentDeductions: status.currentDeductions,
            nextDeductions: status.nextDeductions
        };

        setSelectedEmployee(evaluation);
        setShowModal(true);
    };

    const getStatusIcon = (status: 'met' | 'pending' | 'not-met') => {
        switch (status) {
            case 'met':
                return <FaCheck className="text-green-500" />;
            case 'pending':
                return <FaExclamationTriangle className="text-yellow-500" />;
            case 'not-met':
                return <FaTimes className="text-red-500" />;
        }
    };

    if (loading) {
        return (
            <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="p-4 min-h-screen bg-gray-50 space-y-12">
            {/* Employee Rank Status Cards */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Rank Status</h2>

            {/* Employee Search Input */}
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search employees by name or rank..."
                    value={employeeSearchTerm}
                    onChange={(e) => {
                        setEmployeeSearchTerm(e.target.value);
                        setVisibleEmployeeCount(8); // Reset visible count on search
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {employees
                    .filter(emp => {
                        const nameMatch = emp.employeeName.toLowerCase().includes(employeeSearchTerm.toLowerCase());
                        const positionMatch = emp.position.toLowerCase().includes(employeeSearchTerm.toLowerCase());
                        return nameMatch || positionMatch;
                    })
                    .slice(0, visibleEmployeeCount)
                    .map((emp) => {
                        const status = getCurrentAndNextRank(emp, rateMatrix, salaryMatrix);
                        return (
                            <div
                                key={emp.id}
                                className="bg-white rounded-lg shadow p-4 flex flex-col space-y-2 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleEmployeeClick(emp)}
                            >
                                <div className="text-base font-semibold text-blue-900 mb-1">{emp.employeeName}</div>
                                <div className="text-xs text-gray-500">{emp.position}</div>
                                <div className="text-xs text-gray-500">{emp.department}</div>
                                <div className="text-xs text-gray-500">Type: {emp.employeeType}</div>
                            </div>
                        );
                    })}
            </div>

            {/* Load More Button */}
            {visibleEmployeeCount < employees.filter(emp => {
                const nameMatch = emp.employeeName.toLowerCase().includes(employeeSearchTerm.toLowerCase());
                const positionMatch = emp.position.toLowerCase().includes(employeeSearchTerm.toLowerCase());
                return nameMatch || positionMatch;
            }).length && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setVisibleEmployeeCount(prev => prev + 8)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Load More ({employees.filter(emp => {
                                const nameMatch = emp.employeeName.toLowerCase().includes(employeeSearchTerm.toLowerCase());
                                const positionMatch = emp.position.toLowerCase().includes(employeeSearchTerm.toLowerCase());
                                return nameMatch || positionMatch;
                            }).length - visibleEmployeeCount} remaining)
                        </button>
                    </div>
                )}

            {/* Evaluation Modal */}
            {showModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedEmployee.name}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Employee Evaluation Details</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Rank and Rate/Salary Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Current Status</h3>
                                    <p className="text-sm text-gray-600">Rank: {selectedEmployee.currentRank}</p>

                                    {/* Display income details based on employee type */}
                                    {selectedEmployee.currentRate && selectedEmployee.currentSalary ? ( // Dual-status
                                        <>
                                            <p className="text-sm text-gray-600">Full-time Salary: ₱{Number(selectedEmployee.currentSalary).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Part-time Rate: ₱{Number(selectedEmployee.currentRate).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Part-time Monthly Rate: ₱{Number(selectedEmployee.currentMonthlyRate).toLocaleString()}</p>
                                        </>
                                    ) : selectedEmployee.currentRate && !selectedEmployee.currentSalary ? ( // Part-time
                                        <>
                                            <p className="text-sm text-gray-600">Hourly Rate: ₱{Number(selectedEmployee.currentRate).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Monthly Rate: ₱{Number(selectedEmployee.currentMonthlyRate).toLocaleString()}</p>
                                        </>
                                    ) : selectedEmployee.currentSalary && !selectedEmployee.currentRate ? ( // Full-time
                                        <>
                                            <p className="text-sm text-gray-600">Salary: ₱{Number(selectedEmployee.currentSalary).toLocaleString()}</p>
                                        </>
                                    ) : null}

                                    {/* Deductions and Net based on employee type */}
                                    {selectedEmployee.currentDeductions && ( // Check if deductions exist
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            {selectedEmployee.currentSalary ? ( // Full-time deductions
                                                <>
                                                    <p className="text-sm font-medium text-gray-700">Deductions:</p>
                                                    <p className="text-sm text-gray-600">SSS: ₱{selectedEmployee.currentDeductions?.sss}</p>
                                                    <p className="text-sm text-gray-600">Pag-IBIG: ₱{selectedEmployee.currentDeductions?.pagibig}</p>
                                                    <p className="text-sm text-gray-600">PhilHealth: ₱{selectedEmployee.currentDeductions?.philhealth}</p>
                                                    <p className="text-sm font-medium text-gray-700">Total Deductions: ₱{selectedEmployee.currentDeductions?.totalDeductions}</p>
                                                    <p className="text-sm font-bold text-green-600 mt-2">Net Salary: ₱{(Number(selectedEmployee.currentSalary) - Number(selectedEmployee.currentDeductions.totalDeductions)).toLocaleString()}</p>
                                                </>
                                            ) : selectedEmployee.currentRate && ( // Part-time no deductions
                                                <p className="text-sm font-bold text-green-600 mt-2">Net Monthly Rate: ₱{Number(selectedEmployee.currentMonthlyRate).toLocaleString()}</p>
                                            )}
                                        </div>
                                    )}

                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Next Level</h3>
                                    <p className="text-sm text-gray-600">Rank: {selectedEmployee.nextRank}</p>
                                    {/* Display income details based on employee type */}
                                    {selectedEmployee.nextRate && selectedEmployee.nextSalary ? ( // Dual-status
                                        <>
                                            <p className="text-sm text-gray-600">Full-time Salary: ₱{Number(selectedEmployee.nextSalary).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Part-time Rate: ₱{Number(selectedEmployee.nextRate).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Part-time Monthly Rate: ₱{Number(selectedEmployee.nextMonthlyRate).toLocaleString()}</p>
                                        </>
                                    ) : selectedEmployee.nextRate && !selectedEmployee.nextSalary ? ( // Part-time
                                        <>
                                            <p className="text-sm text-gray-600">Next Hourly Rate: ₱{Number(selectedEmployee.nextRate).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Next Monthly Rate: ₱{Number(selectedEmployee.nextMonthlyRate).toLocaleString()}</p>
                                        </>
                                    ) : selectedEmployee.nextSalary && !selectedEmployee.nextRate ? ( // Full-time
                                        <>
                                            <p className="text-sm text-gray-600">Salary: ₱{Number(selectedEmployee.nextSalary).toLocaleString()}</p>
                                        </>
                                    ) : null}

                                    {/* Deductions and Net based on employee type */}
                                    {selectedEmployee.nextDeductions && ( // Check if deductions exist
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            {selectedEmployee.nextSalary ? ( // Full-time deductions
                                                <>
                                                    <p className="text-sm font-medium text-gray-700">Deductions:</p>
                                                    <p className="text-sm text-gray-600">SSS: ₱{selectedEmployee.nextDeductions?.sss}</p>
                                                    <p className="text-sm text-gray-600">Pag-IBIG: ₱{selectedEmployee.nextDeductions?.pagibig}</p>
                                                    <p className="text-sm text-gray-600">PhilHealth: ₱{selectedEmployee.nextDeductions?.philhealth}</p>
                                                    <p className="text-sm font-medium text-gray-700">Total Deductions: ₱{selectedEmployee.nextDeductions?.totalDeductions}</p>
                                                    <p className="text-sm font-bold text-green-600 mt-2">Net Salary: ₱{(Number(selectedEmployee.nextSalary) - Number(selectedEmployee.nextDeductions.totalDeductions)).toLocaleString()}</p>
                                                </>
                                            ) : selectedEmployee.nextRate && ( // Part-time no deductions
                                                <p className="text-sm font-bold text-green-600 mt-2">Net Monthly Rate: ₱{Number(selectedEmployee.nextMonthlyRate).toLocaleString()}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Evaluation Criteria */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-4">Evaluation Criteria</h3>
                                <div className="space-y-4">
                                    {selectedEmployee.evaluationCriteria.map((criteria, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-700">{criteria.category}</h4>
                                                {getStatusIcon(criteria.status)}
                                            </div>
                                            <ul className="list-disc list-inside space-y-1">
                                                {criteria.requirements.map((req, i) => (
                                                    <li key={i} className="text-sm text-gray-600">{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Evaluation Dates</h3>
                                    <p className="text-sm text-gray-600">Last Evaluation: {selectedEmployee.lastEvaluationDate}</p>
                                    <p className="text-sm text-gray-600">Next Evaluation: {selectedEmployee.nextEvaluationDate}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-700 mb-2">Performance Score</h3>
                                    <div className="flex items-center">
                                        <div className="text-2xl font-bold text-blue-600">{selectedEmployee.performanceScore}%</div>
                                        <div className="ml-2 text-sm text-gray-500">Overall Score</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-4">Recommendations</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <ul className="list-disc list-inside space-y-2">
                                        {selectedEmployee.recommendations.map((rec, index) => (
                                            <li key={index} className="text-sm text-gray-600">{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ranking Matrix Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Ranking Matrix (Non-PRC)</h2>
                            <p className="text-sm text-gray-500 mt-1">School Year: {rateMatrix[0]?.schoolYear}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaFileExport /> Export
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaPrint /> Print
                            </button>
                            <button
                                onClick={() => setShowSalaryDetails(prev => !prev)}
                                className={`flex items-center gap-2 px-4 py-2 ${showSalaryDetails ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors`}
                            >
                                {showSalaryDetails ? 'Hide Salaries' : 'Show Salaries'}
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="mt-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by position or rank..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as 'all' | 'admin' | 'faculty')}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="admin">Admin Only</option>
                                <option value="faculty">Faculty Only</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto" ref={tableRef}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('code')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Code</span>
                                        {sortConfig.key === 'code' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('description')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Description</span>
                                        {sortConfig.key === 'description' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('rate')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Rate</span>
                                        {sortConfig.key === 'rate' && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMatrix.map((r, index) => (
                                <tr key={r.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {r.code}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {r.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                        {showSalaryDetails ? `₱${Number(r.rate).toLocaleString()}` : '***'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Salary Matrix Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-12">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Salary Matrix (Admin & Faculty)</h2>
                    <p className="text-sm text-gray-500 mt-1">School Year: {salaryMatrix[0]?.schoolYear}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs border border-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-2 py-2 text-right font-medium text-gray-500 uppercase border border-gray-300">Admin Personnel</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">#</th>
                                <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase border border-gray-300">Faculty</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">1</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">2</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">3</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">4</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">5</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">6</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">7</th>
                                <th className="px-2 py-2 text-center font-medium text-gray-500 uppercase border border-gray-300">8</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {salaryMatrix.map((row, index) => (
                                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                    <td className="px-2 py-2 whitespace-nowrap text-right border border-gray-300">{row.admin}</td>
                                    <td className="px-2 py-2 whitespace-nowrap text-center border border-gray-300">{row.rank}</td>
                                    <td className="px-2 py-2 whitespace-nowrap border border-gray-300">{row.faculty}</td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.firstIncrement : '***'}
                                        {row.firstRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.firstRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.secondIncrement : '***'}
                                        {row.secondRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.secondRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.thirdIncrement : '***'}
                                        {row.thirdRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.thirdRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.fourthIncrement : '***'}
                                        {row.fourthRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.fourthRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.fifthIncrement : '***'}
                                        {row.fifthRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.fifthRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.sixthIncrement : '***'}
                                        {row.sixthRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.sixthRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.seventhIncrement : '***'}
                                        {row.seventhRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.seventhRemarks})</span>}
                                    </td>
                                    <td className="px-2 py-2 text-right border border-gray-300">
                                        {showSalaryDetails ? row.eighthIncrement : '***'}
                                        {row.eighthRemarks && showSalaryDetails && <span className="text-yellow-700"> ({row.eighthRemarks})</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={handleBackToTop}
                    className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
};

export default MatrixTable;
