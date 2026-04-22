import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from './Modal';
import { EllipsisVertical } from 'lucide-react';
import { fetchHolidays, addOrUpdateHoliday, deleteHoliday, Holiday } from './SchoolCalendarService';

interface HolidayType {
  type: string;
  color: string;
}

const SchoolCalendar = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidayTypes] = useState<HolidayType[]>([
    { type: 'Regular Holiday', color: 'red' },
    { type: 'Special Holiday', color: 'yellow' },
    { type: 'Local Holiday', color: 'green' },
    { type: 'Others', color: 'blue' },
  ]);
  const [newHoliday, setNewHoliday] = useState<Holiday>({
    date: '',
    type: '',
    title: '',
    color: '',
    whole_day: true,
    is_morning: false,
  });
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const fetchedHolidays = await fetchHolidays();
        setHolidays(fetchedHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    loadHolidays();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedType = holidayTypes.find((ht) => ht.type === newHoliday.type);
    if (selectedType) {
      newHoliday.color = selectedType.color;
    }

    try {
      console.log("Adding/updating holiday:", newHoliday); // Debugging information
      await addOrUpdateHoliday(newHoliday);
      alert(editIndex !== null ? "Holiday updated successfully!" : "Holiday created successfully!");
      setNewHoliday({ 
        date: '',
        type: '',
        title: '',
        color: '',
        whole_day: true,
        is_morning: false,
      });
      setIsHolidayModalOpen(false);
      setEditIndex(null);
      // Reload holidays after adding/updating
      const fetchedHolidays = await fetchHolidays();
      setHolidays(fetchedHolidays);
    } catch (error) {
      console.error("Error adding/updating holiday:", error);
    }
  };

  const handleDeleteHoliday = async (title: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this holiday?");
    if (!confirmed) return;

    try {
      await deleteHoliday(title);
      alert("Holiday deleted successfully!");
      const updatedHolidays = holidays.filter((holiday) => holiday.title !== title);
      setHolidays(updatedHolidays);
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  const handleEditHoliday = (index: number) => {
    const holidayToEdit = holidays[index];
    setNewHoliday(holidayToEdit);
    setIsHolidayModalOpen(true);
    setEditIndex(index);
  };

  const isAddHolidayDisabled = !newHoliday.date || !newHoliday.type || !newHoliday.title;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">School Calendar</h1>
        <Button variant="default" size="sm" className='mt-4 mr-6' onClick={() => setIsHolidayModalOpen(true)}>
          Create
        </Button>
      </div>
      <div>
        {/* <h2 className="text-xl font-semibold mb-2">No Classes</h2> */}
        <table className="w-full text-left mt-12">
          <thead>
            <tr>
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Color</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Time Selection</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 group">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{holiday.date}</td>
                <td className="px-4 py-2">{holiday.type}</td>
                <td className="px-4 py-2">{holiday.title}</td>
                <td className="px-4 py-2 font-semibold" style={{ color: holiday.color }}>{holiday.color}</td>
                <td className="px-4 py-2">{holiday.whole_day ? 'Whole Day' : 'Half Day'}</td>
                <td className="px-4 py-2">{holiday.whole_day ? '' : holiday.is_morning ? 'Morning' : 'Afternoon'}</td>
                <td className="px-4 py-2 text-right relative">
                  <div className="relative inline-block text-left">
                    <button
                      className="inline-flex justify-center w-8 h-8 rounded-md text-gray-500 hover:text-gray-700 group-hover:opacity-100 opacity-0 transition-opacity"
                      onClick={() => setMenuOpenIndex(menuOpenIndex === index ? null : index)}
                    >
                      <EllipsisVertical size={20} className="opacity-70" />
                    </button>
                    {menuOpenIndex === index && (
                      <div
                        ref={menuRef}
                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex={-1}
                      >
                        <div className="py-1" role="none">
                          <button
                            onClick={() => {
                              handleEditHoliday(index);
                              setMenuOpenIndex(null);
                            }}
                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-0"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteHoliday(holiday.title);
                              setMenuOpenIndex(null);
                            }}
                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                            tabIndex={-1}
                            id="menu-item-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isHolidayModalOpen} onClose={() => setIsHolidayModalOpen(false)}>
        <form onSubmit={handleAddHoliday}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit Holiday' : 'Add Holiday'}</h2>
            <Input
              type="date"
              value={newHoliday.date}
              onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
              className="mb-2 w-full"
            />
            <div className="relative mb-2 w-full">
              <select
                value={newHoliday.type}
                onChange={(e) => {
                  const selectedType = holidayTypes.find((ht) => ht.type === e.target.value);
                  setNewHoliday({ ...newHoliday, type: e.target.value, color: selectedType ? selectedType.color : '' });
                }}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Type</option>
                {holidayTypes.map((ht, index) => (
                  <option key={index} value={ht.type}>
                    {ht.type}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type="text"
              placeholder="Holiday Title"
              value={newHoliday.title}
              onChange={(e) => setNewHoliday({ ...newHoliday, title: e.target.value })}
              className="mb-4 w-full"
            />
            <div className="relative mb-2 w-full">
              <select
                value={newHoliday.whole_day ? 'Whole Day' : 'Half Day'}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewHoliday({
                    ...newHoliday,
                    whole_day: value === 'Whole Day',
                    is_morning: value === 'Half Day' ? newHoliday.is_morning : false
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Duration</option>
                <option value="Whole Day">Whole Day</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>
            {!newHoliday.whole_day && (
              <div className="relative mb-2 w-full">
                <select
                  value={newHoliday.is_morning ? 'Morning' : 'Afternoon'}
                  onChange={(e) => setNewHoliday({ ...newHoliday, is_morning: e.target.value === 'Morning' })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                </select>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => setIsHolidayModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" size="sm" type="submit" disabled={isAddHolidayDisabled}>
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchoolCalendar;