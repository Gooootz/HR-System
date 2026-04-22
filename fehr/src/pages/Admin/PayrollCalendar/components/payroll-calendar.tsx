import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PayPeriod {
    id?: string;
    startDate: string;
    endDate: string;
    cutoffDate: string;
    dueDate: string;
    payDate: string;
    status: string;
}

const statusColors: Record<string, string> = {
    Processed: '#4CAF50',
    Pending: '#FFC107',
    Processing: '#2196F3',
    Completed: '#9C27B0',
};

function formatDisplayDate(dateStr: string | undefined) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    }).replace(/,/g, ''); // Remove comma for "January 01 2025"
}

const PayrollCalendar: React.FC = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
    const [originalPeriods, setOriginalPeriods] = useState<PayPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<(PayPeriod & { index?: number }) | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:5206/api/payrollcalendar/get-payroll-dates-by-year/${year}`);
                setPayPeriods(res.data || []);
                setOriginalPeriods(res.data || []);
            } catch (err) {
                setError('Failed to fetch payroll data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [year]);

    const generateYearlyPayroll = () => {
        const newPeriods: PayPeriod[] = [];

        for (let month = 0; month < 12; month++) {
            // First period: 1st to 15th
            const firstStart = new Date(year, month, 2);
            const firstEnd = new Date(year, month, 16);
            const firstCutoff = new Date(year, month, 26);
            const firstDue = new Date(firstCutoff);
            firstDue.setDate(firstDue.getDate() + 2);
            const firstPay = new Date(year, month + 1, 1); // last day of current month

            newPeriods.push({
                startDate: firstStart.toISOString().split('T')[0],
                endDate: firstEnd.toISOString().split('T')[0],
                cutoffDate: firstCutoff.toISOString().split('T')[0],
                dueDate: firstDue.toISOString().split('T')[0],
                payDate: firstPay.toISOString().split('T')[0],
                status: 'Pending',
            });

            // Second period: 16th to end of month
            const secondStart = new Date(year, month, 17);
            const secondEnd = new Date(year, month + 1, 0); // last day of current month
            // For cutoff/paydate, must handle year rollover for December
            let nextMonth = month + 1;
            let nextYear = year;
            if (nextMonth > 11) {
                nextMonth = 0;
                nextYear = year + 1;
            }
            const secondCutoff = new Date(nextYear, nextMonth, 11); // 10th of next month
            const secondDue = new Date(secondCutoff);
            secondDue.setDate(secondDue.getDate() + 2)
            const secondPay = new Date(nextYear, nextMonth, 16); // 15th of next month

            newPeriods.push({
                startDate: secondStart.toISOString().split('T')[0],
                endDate: secondEnd.toISOString().split('T')[0],
                cutoffDate: secondCutoff.toISOString().split('T')[0],
                dueDate: secondDue.toISOString().split('T')[0],
                payDate: secondPay.toISOString().split('T')[0],
                status: 'Pending',
            });
        }

        setPayPeriods(newPeriods);
        setOriginalPeriods([...newPeriods]);
    };


    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newYear = parseInt(e.target.value);
        if (!isNaN(newYear)) setYear(newYear);
    };

    const addPayPeriod = () => {
        setPayPeriods(prev => [
            ...prev,
            {
                startDate: '',
                endDate: '',
                cutoffDate: '',
                dueDate: '',
                payDate: '',
                status: 'Pending',
            },
        ]);
    };

    const selectPeriodForUpdate = (period: PayPeriod, index: number) => {
        setSelectedPeriod({ ...period, index });
    };

    const updateSelectedPeriod = async () => {
        if (!selectedPeriod || selectedPeriod.index === undefined) return;

        setIsLoading(true);
        try {
            const updated = [...payPeriods];
            updated[selectedPeriod.index] = selectedPeriod;
            setPayPeriods(updated);

            await axios.put(
                `http://localhost:5206/api/payrollcalendar/update-payroll-date/${selectedPeriod.id}`,
                selectedPeriod
            );

            setOriginalPeriods(updated);
            setSelectedPeriod(null);
            alert('Period updated successfully!');
        } catch (err) {
            setError('Failed to update payroll period. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveChanges = async () => {
        setIsLoading(true);
        try {
            await axios.post(
                'http://localhost:5206/api/payrollcalendar/add-payroll-dates',
                payPeriods
            );
            setOriginalPeriods([...payPeriods]);
            alert('Changes saved successfully!');
        } catch (err) {
            setError('Failed to save payroll data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const undoChanges = () => {
        setPayPeriods([...originalPeriods]);
    };

    const deletePayPeriod = async (index: number) => {
        const toDelete = payPeriods[index];
        if (!toDelete?.id) {
            setPayPeriods(prev => prev.filter((_, i) => i !== index));
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:5206/api/payrollcalendar/delete-payroll-date/${toDelete.id}`);
            setPayPeriods(prev => prev.filter((_, i) => i !== index));
            setOriginalPeriods(prev => prev.filter((_, i) => i !== index));
        } catch (err) {
            setError('Failed to delete payroll period. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const editableFields: { label: string; field: keyof PayPeriod }[] = [
        { label: 'Start Date', field: 'startDate' },
        { label: 'End Date', field: 'endDate' },
        { label: 'Cutoff Date', field: 'cutoffDate' },
        { label: 'Due Date', field: 'dueDate' },
        { label: 'Pay Date', field: 'payDate' },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">{year} Payroll Calendar</h2>
                <div>
                    <input
                        type="number"
                        value={year}
                        onChange={handleYearChange}
                        min={2000}
                        max={2100}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <button onClick={generateYearlyPayroll} className="ml-2 px-6 py-2 bg-blue-500 text-white rounded">
                        Generate Payroll
                    </button>
                </div>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {isLoading && <p>Loading...</p>}

            {selectedPeriod && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg mb-4">Update Pay Period</h3>
                        {editableFields.map(({ label, field }) => (
                            <div key={field} className="mb-4">
                                <label className="block mb-2 text-sm">{label}</label>
                                <input
                                    type="date"
                                    value={selectedPeriod[field]}
                                    onChange={e => setSelectedPeriod({ ...selectedPeriod, [field]: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>
                        ))}
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setSelectedPeriod(null)} className="px-4 py-2 bg-gray-500 text-white rounded">
                                Cancel
                            </button>
                            <button onClick={updateSelectedPeriod} className="px-4 py-2 bg-blue-500 text-white rounded">
                                {isLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-4">Semi-Monthly Pay Schedule ({payPeriods.length} Pay Periods)</p>

            <table className="min-w-full mt-4 table-auto">
                <thead>
                    <tr>
                        {['Start Date', 'End Date', 'Cutoff Date', 'Due Date', 'Pay Date', 'Status', 'Actions'].map(h => (
                            <th key={h} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left text-gray-500 bg-gray-100">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payPeriods.map((p, i) => (
                        <tr key={i}>
                            {(['startDate', 'endDate', 'cutoffDate', 'dueDate', 'payDate'] as (keyof PayPeriod)[]).map(field => (
                                <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDisplayDate(p[field])}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span
                                    style={{ backgroundColor: statusColors[p.status] || '#999' }}
                                    className="px-4 py-1 rounded-full text-white text-xs"
                                >
                                    {p.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <button onClick={() => selectPeriodForUpdate(p, i)} className="px-4 py-2 ">
                                    Edit
                                </button>
                                <button onClick={() => deletePayPeriod(i)} className="px-4 py-2">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <button onClick={addPayPeriod} className="px-6 py-2 bg-green-500 text-white rounded">
                    + Add
                </button>
                <button onClick={saveChanges} disabled={isLoading} className={`ml-2 px-6 py-2 rounded ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white'}`}>
                    {isLoading ? 'Saving...' : 'Save All'}
                </button>
                <button onClick={undoChanges} disabled={isLoading} className="ml-2 px-6 py-2 bg-gray-500 text-white rounded">
                    Undo
                </button>
            </div>
        </div>
    );
};

export default PayrollCalendar;
