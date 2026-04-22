import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CalendarDays,
    CalendarCheck,
    Clock,
    Users,
    ClipboardList,
    Banknote,
    ChevronDown,
    Search,
    Filter,
    Download,
    // MoreHorizontal,
    Eye,
    EyeOff
} from 'lucide-react';

const PayrollSalaries = () => {
    // State for payroll data
    interface Payroll {
        id: string;
        employee_Id: number;
        employee: string;
        position: string;
        period: string;
        status: string;
        netPay: number;
        paymentDate: string;
        isFirstHalf: boolean;
        dtrEntries?: any[];
    }

    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleRows, setVisibleRows] = useState<{ [key: number]: boolean }>({});
    const [showAll, setShowAll] = useState(false);
    const itemsPerPage = 10;
    const [showDtrModal, setShowDtrModal] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

    const toggleVisibility = (id: number) => {
        setVisibleRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleShowAll = () => {
        const newShowAll = !showAll;
        setShowAll(newShowAll);

        // Update visibility for all payrolls
        const newVisibility: { [key: number]: boolean } = {};
        payrolls.forEach(payroll => {
            newVisibility[payroll.employee_Id] = newShowAll;
        });
        setVisibleRows(newVisibility);
    };

    const handleViewDTR = (payroll: Payroll) => {
        setSelectedPayroll(payroll);
        setShowDtrModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                // Fetch DTR records
                const dtrResponse = await axios.get('http://localhost:5018/api/dtr/get-all-dtr-records');
                const dtrRecords = dtrResponse.data;

                // Fetch payroll calendar
                const payrollCalendarResponse = await axios.get('http://localhost:5206/api/payrollcalendar/get-payroll-dates');
                const payrollCalendar = payrollCalendarResponse.data;

                const hourlyRate = 120; // Example hourly rate, adjust as needed

                // First group by employee ID and calculate total hours
                const employeeTotals = dtrRecords.reduce((acc: any, record: any) => {
                    const { employee_Id, entries } = record;

                    // If this employee hasn't been processed yet, initialize their total
                    if (!acc[employee_Id]) {
                        acc[employee_Id] = {
                            totalHours: 0,
                            entries: []
                        };
                    }

                    // Add all entries for this employee
                    acc[employee_Id].entries.push(...entries);

                    // Calculate total hours for this record's entries
                    const recordHours = entries.reduce((sum: number, entry: any) => {
                        const [hours, minutes] = entry.totalHours.split(':').map(Number);
                        return sum + hours + (minutes / 60);
                    }, 0);

                    // Add to employee's total hours
                    acc[employee_Id].totalHours += recordHours;

                    return acc;
                }, {});

                // Now create payroll entries for each employee
                const groupedPayrolls: Payroll[] = Object.entries(employeeTotals).flatMap(([employee_Id, data]: [string, any]) => {
                    const { totalHours, entries } = data;
                    const totalNetPay = Math.round(totalHours * hourlyRate * 100) / 100;

                    // Helper to format date as YYYY-M-D
                    const formatDate = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

                    const payrolls: Payroll[] = [];

                    // First half: 1-15
                    const firstHalfEntries = entries.filter((entry: any) => {
                        const entryDate = new Date(entry.date);
                        const periodStart = new Date(entry.date);
                        periodStart.setDate(1);
                        const periodMid = new Date(entry.date);
                        periodMid.setDate(15);
                        return entryDate >= periodStart && entryDate <= periodMid;
                    });
                    if (firstHalfEntries.length > 0) {
                        const anyEntry = firstHalfEntries[0];
                        const periodStart = new Date(anyEntry.date); periodStart.setDate(1);
                        const periodMid = new Date(anyEntry.date); periodMid.setDate(15);
                        const periodLabel = `${formatDate(periodStart)} to ${formatDate(periodMid)}`;
                        // Find matching calendar period
                        const calendarPeriod = payrollCalendar.find((p: any) => {
                            const pStart = new Date(p.startDate);
                            const pEnd = new Date(p.endDate);
                            return pStart.getTime() === periodStart.getTime() && pEnd.getTime() === periodMid.getTime();
                        });
                        payrolls.push({
                            id: `${employee_Id} First Half`,
                            employee_Id: parseInt(employee_Id),
                            employee: `Employee ${employee_Id}`,
                            position: 'N/A',
                            period: periodLabel,
                            status: calendarPeriod?.status || 'Pending',
                            netPay: Math.round((firstHalfEntries.reduce((sum: number, entry: any) => { const [hours, minutes] = entry.totalHours.split(':').map(Number); return sum + hours + (minutes / 60); }, 0) / totalHours) * totalNetPay * 100) / 100,
                            paymentDate: calendarPeriod?.payDate || '',
                            isFirstHalf: true,
                            dtrEntries: firstHalfEntries,
                        });
                    }

                    // Second half: 16-end
                    const secondHalfEntries = entries.filter((entry: any) => {
                        const entryDate = new Date(entry.date);
                        const periodMid = new Date(entry.date);
                        periodMid.setDate(16);
                        const periodEnd = new Date(periodMid.getFullYear(), periodMid.getMonth() + 1, 0);
                        return entryDate >= periodMid && entryDate <= periodEnd;
                    });
                    if (secondHalfEntries.length > 0) {
                        const anyEntry = secondHalfEntries[0];
                        const periodMid = new Date(anyEntry.date); periodMid.setDate(16);
                        const periodEnd = new Date(periodMid.getFullYear(), periodMid.getMonth() + 1, 0);
                        const periodLabel = `${formatDate(periodMid)} to ${formatDate(periodEnd)}`;
                        // Find matching calendar period
                        const calendarPeriod = payrollCalendar.find((p: any) => {
                            const pStart = new Date(p.startDate);
                            const pEnd = new Date(p.endDate);
                            return pStart.getTime() === periodMid.getTime() && pEnd.getTime() === periodEnd.getTime();
                        });
                        payrolls.push({
                            id: `${employee_Id} Second Half`,
                            employee_Id: parseInt(employee_Id),
                            employee: `Employee ${employee_Id}`,
                            position: 'N/A',
                            period: periodLabel,
                            status: calendarPeriod?.status || 'Pending',
                            netPay: Math.round((secondHalfEntries.reduce((sum: number, entry: any) => { const [hours, minutes] = entry.totalHours.split(':').map(Number); return sum + hours + (minutes / 60); }, 0) / totalHours) * totalNetPay * 100) / 100,
                            paymentDate: calendarPeriod?.payDate || '',
                            isFirstHalf: false,
                            dtrEntries: secondHalfEntries,
                        });
                    }

                    return payrolls;
                });

                // Sort payrolls by employee ID and then by period (first half first)
                const sortedPayrolls = groupedPayrolls.sort((a, b) => {
                    if (a.employee_Id !== b.employee_Id) {
                        return a.employee_Id - b.employee_Id;
                    }
                    return a.isFirstHalf ? -1 : 1;
                });

                setPayrolls(sortedPayrolls);

                // Initialize visibility state
                const initialVisibility: { [key: number]: boolean } = {};
                sortedPayrolls.forEach((payroll) => {
                    initialVisibility[payroll.employee_Id] = false;
                });
                setVisibleRows(initialVisibility);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter payrolls by search term and selected period
    const filteredPayrolls = payrolls.filter(payroll => {
        const matchesSearch = payroll.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payroll.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPeriod = selectedPeriod ? payroll.period === selectedPeriod : true;
        return matchesSearch && matchesPeriod;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
    const paginatedPayrolls = filteredPayrolls.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Get unique periods for filter dropdown
    const uniquePeriods = [...new Set(payrolls.map(payroll => payroll.period))];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Banknote className="mr-2 h-6 w-6" />
                        Semi-Monthly Payroll Payments
                    </h1>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                        Process New Payroll
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 text-gray-500 mr-2" />
                                <select
                                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                >
                                    <option value="">All Periods</option>
                                    {uniquePeriods.map(period => (
                                        <option key={period} value={period}>{period}</option>
                                    ))}
                                </select>
                            </div>
                            {/* <button
                                onClick={toggleShowAll}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                {showAll ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                                {showAll ? 'Hide All' : 'Show All'}
                            </button> */}
                            <button className="flex items-center text-gray-600 hover:text-gray-800">
                                <Download className="h-4 w-4 mr-1" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payroll Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading payroll data...
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Position
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                                <CalendarDays className="h-4 w-4 mr-1" />
                                                Period
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={toggleShowAll}
                                            >
                                                Net Pay {showAll ? <EyeOff className="inline h-4 w-4 ml-1" /> : <Eye className="inline h-4 w-4 ml-1" />}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                                                <CalendarCheck className="h-4 w-4 mr-1" />
                                                Payment Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedPayrolls.length > 0 ? (
                                            paginatedPayrolls.map((payroll) => (
                                                <tr key={payroll.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <Users className="h-5 w-5" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {payroll.employee}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {payroll.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payroll.position}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payroll.period}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payroll.status === 'Processed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : payroll.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {payroll.status}
                                                        </span>
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                                                        onClick={() => toggleVisibility(payroll.employee_Id)}
                                                    >
                                                        <div className="flex items-center">
                                                            {visibleRows[payroll.employee_Id] ? (
                                                                `₱ ${payroll.netPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
                                                            ) : (
                                                                '•••••••'
                                                            )}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleVisibility(payroll.employee_Id);
                                                                }}
                                                                className="ml-2 text-gray-400 hover:text-gray-600"
                                                            >
                                                                {visibleRows[payroll.employee_Id] ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payroll.paymentDate}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleViewDTR(payroll)}>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                    No payroll records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredPayrolls.length > itemsPerPage && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredPayrolls.length)}
                                                </span>{' '}
                                                of <span className="font-medium">{filteredPayrolls.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => setCurrentPage(1)}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">First</span>
                                                    «
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    ‹
                                                </button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    ›
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Last</span>
                                                    »
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Payrolls</p>
                                <p className="text-2xl font-semibold text-gray-900">{payrolls.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <CalendarCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Processed</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {payrolls.filter(p => p.status === 'Processed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {payrolls.filter(p => p.status === 'Pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DTR Modal */}
                {showDtrModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity" onClick={() => setShowDtrModal(false)} />
                        {/* Modal Card */}
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-8 animate-fadeIn flex flex-col">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-bold focus:outline-none"
                                onClick={() => setShowDtrModal(false)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">DTR Records</h2>
                            <div className="text-center text-gray-600 mb-6">
                                <span className="font-semibold">{selectedPayroll?.employee}</span> <span className="mx-2">|</span> <span>{selectedPayroll?.period}</span>
                            </div>
                            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50">
                                <table className="min-w-full text-sm text-gray-700">
                                    <thead className="sticky top-0 bg-blue-100 z-10">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold">Date</th>
                                            <th className="px-4 py-2 text-left font-semibold">AM In</th>
                                            <th className="px-4 py-2 text-left font-semibold">AM Out</th>
                                            <th className="px-4 py-2 text-left font-semibold">PM In</th>
                                            <th className="px-4 py-2 text-left font-semibold">PM Out</th>
                                            <th className="px-4 py-2 text-left font-semibold">Total Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPayroll?.dtrEntries && selectedPayroll.dtrEntries.length === 0 ? (
                                            <tr><td colSpan={6} className="text-center py-4 text-gray-400">No DTR records found.</td></tr>
                                        ) : selectedPayroll?.dtrEntries?.map((entry: any, idx: number) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                                <td className="px-4 py-2 whitespace-nowrap">{entry.date}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">{entry.time_in_am || entry.timeinam}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">{entry.time_out_am || entry.timeoutam}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">{entry.time_in_pm || entry.timeinpm}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">{entry.time_out_pm || entry.timeoutpm}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">{entry.totalHours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollSalaries;