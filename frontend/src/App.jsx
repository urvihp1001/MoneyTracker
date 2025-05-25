import { useState, useEffect } from 'react';
import './App.css';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { publicRequest } from './requestMethods';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#e75480'];

const sortByDate = (data) => data.sort((a, b) => new Date(a.date) - new Date(b.date));

// Helper to check if a date string is in the selected month
const isInSelectedMonth = (dateStr, selectedMonth) => {
  // dateStr: "YYYY-MM-DD", selectedMonth: "YYYY-MM"
  return dateStr && dateStr.startsWith(selectedMonth);
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    method: '',
    category: '',
    amount: '',
    date: ''
  });

  // NEW: Month selector state
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        const sortedExpenses = sortByDate(res.data.expenses);
        setExpenses(sortedExpenses);
        // Don't filter here, filtering is handled below
        setFilteredExpenses(sortedExpenses);
      } catch (error) {
        console.error(error);
      }
    };
    getExpenses();
  }, []);

  // NEW: Filter by selected month and search term
  useEffect(() => {
    let filtered = expenses.filter(
      (expense) => isInSelectedMonth(expense.date, selectedMonth)
    );
    if (searchTerm) {
      filtered = filtered.filter(
        (expense) =>
          (expense.name && expense.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (expense.category && expense.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (expense.method && expense.method.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredExpenses(filtered);
  }, [expenses, selectedMonth, searchTerm]);

  const handleSearch = () => {
    // Search is now handled by the effect above
    // Just trigger the effect by updating searchTerm
    setSearchTerm(searchTerm.trim());
  };

  const handleAddExpense = async () => {
    if (editIndex !== null) {
      try {
        const updatedExpense = {
          ...formData,
          amount: Number(formData.amount)
        };
        await publicRequest.put(`/expenses/${expenses[editIndex]._id}`, updatedExpense);
        const updatedExpenses = [...expenses];
        updatedExpenses[editIndex] = { ...updatedExpense, _id: expenses[editIndex]._id };
        const sorted = sortByDate(updatedExpenses);
        setExpenses(sorted);
        setEditIndex(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res = await publicRequest.post("/expenses", {
          ...formData,
          amount: Number(formData.amount)
        });
        const newExpenses = sortByDate([...expenses, res.data]);
        setExpenses(newExpenses);
      } catch (error) {
        console.error(error);
      }
    }
    setFormData({ name: '', method: '', category: '', amount: '', date: '' });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      const updatedExpenses = expenses.filter((expense) => expense._id !== id);
      const sorted = sortByDate(updatedExpenses);
      setExpenses(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setFormData(filteredExpenses[index]);
    const originalIndex = expenses.findIndex(e => e._id === filteredExpenses[index]._id);
    setEditIndex(originalIndex);
    setShowModal(true);
  };

  // Only show category data for the selected month
  const categoryData = Object.values(
    filteredExpenses.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
      acc[curr.category].value += Number(curr.amount);
      return acc;
    }, {})
  );

  // Only show total for the selected month
  const totalAmount = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mx-auto">
      <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>

      {/* Month Selector */}
      <div className="flex items-center justify-between mt-5 w-full">
        <div className="flex items-center gap-4">
          <label className="font-semibold">Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="flex justify-between w-[300px]">
          <button
            className="bg-[#e75480] p-[10px] border-none outline-none cursor-pointer text-white text-medium"
            onClick={() => {
              setFormData({ name: '', method: '', category: '', amount: '', date: '' });
              setEditIndex(null);
              setShowModal(true);
            }}
          >
            Add Expense
          </button>
          <button
            className="bg-blue-500 p-[10px] border-none outline-none cursor-pointer text-white text-medium"
            onClick={() => setShowReport(!showReport)}
          >
            Expense Report
          </button>
        </div>
        <div className="ml-auto flex gap-2">
          <input
            type="text"
            placeholder="Search expenses..."
            className="border border-gray-300 rounded-md p-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <p className="text-lg font-semibold mt-4 text-green-700">
        Total Spent: ₹{totalAmount.toFixed(2)}
      </p>
      <p className="text-md text-gray-500 mb-2">
        Showing expenses for: <span className="font-semibold">{selectedMonth}</span>
      </p>

      <div className="w-full mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider">
              <th className="p-3">Name</th>
              <th className="p-3">Method</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No expenses for this month.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{expense.name}</td>
                  <td className="p-3">{expense.method}</td>
                  <td className="p-3">{expense.category}</td>
                  <td className="p-3">₹{Number(expense.amount).toFixed(2)}</td>
                  <td className="p-3">{expense.date}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">{editIndex !== null ? 'Edit' : 'Add'} Expense</h2>
            <input
              type="text"
              placeholder="Expense Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full mb-2 p-2 border rounded bg-white"
            >
              <option value="">Select Payment Method</option>
              <option value="GPay">GPay</option>
              <option value="Neu">Neu</option>
              <option value="BOB">BOB</option>
            </select>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full mb-2 p-2 border rounded bg-white"
            >
              <option value="">Select Category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grocery">Grocery</option>
              <option value="Urvi">Urvi</option>
              <option value="Anuja">Anuja</option>
              <option value="Misc">Misc</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleAddExpense}
              >
                {editIndex !== null ? 'Update' : 'Add'} Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="mt-10 w-full flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value)=>`₹${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-8 w-full max-w-md">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-right">{item.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
