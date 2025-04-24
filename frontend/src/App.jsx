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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

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

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await publicRequest.get("/expenses");
        setExpenses(res.data.expenses);  // Assuming the expenses are in the 'expenses' field
        setFilteredExpenses(res.data.expenses);  // Set both states when data is fetched
      } catch (error) {
        console.error(error);
      }
    };
    getExpenses();
  }, []);


  const handleSearch = () => {
    const filtered = expenses.filter(
      (expense) =>
        (expense.name && expense.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (expense.category && expense.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (expense.method && expense.method.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredExpenses(filtered);
  };

  const handleAddExpense = async () => {
    if (editIndex !== null) {
      try {
        await publicRequest.put(`/expenses/${expenses[editIndex]._id}`, {
           name: formData.name,
          method: formData.method,
          category: formData.category,
          amount: Number(formData.amount),
          date: formData.date
        });
        setExpenses((prev) => {
          const updated = [...prev];
          updated[editIndex] = { ...formData, amount: Number(formData.amount) };
          return updated;
        });
        setFilteredExpenses((prev) => {  //Also update filtered array
          const updated = [...prev];
          updated[editIndex] = { ...formData, amount: Number(formData.amount) };
          return updated;
        });
        setEditIndex(null);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const res =  await publicRequest.post("/expenses", {
           name: formData.name,
          method: formData.method,
          category: formData.category,
          amount: Number(formData.amount),
          date: formData.date
        });
        setExpenses([...expenses, res.data]);
        setFilteredExpenses([...filteredExpenses, res.data]);
      } catch (error) {
        console.error(error);
      }
    }
    setFormData({  name: '', method: '', category: '', amount: '', date: '' });
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      setFilteredExpenses(filteredExpenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (index) => {
    setFormData(filteredExpenses[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const categoryData = Object.values(
    expenses.reduce((acc, curr) => {
      acc[curr.category] = acc[curr.category] || { name: curr.category, value: 0 };
      acc[curr.category].value += curr.amount;
      return acc;
    }, {})
  );

  return (
    <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mx-auto">
      <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>

      <div className="flex items-center justify-between mt-5 w-full">
        <div className="flex justify-between w-[300px]">
          <button
            className="bg-[#af8978] p-[10px] border-none outline-none cursor-pointer text-white text-medium"
            onClick={() => {
              setFormData({ name: '', method: '', category: '', amount: '', date: '' });
              setEditIndex(null);
              setShowModal(true);
            }}
          >
            Add Expense
          </button>
          <button
            className="bg-blue-300 p-[10px] border-none outline-none cursor-pointer text-black text-medium"
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

      {/* Table */}
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
            {filteredExpenses.map((expense, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{expense.name}</td>
                <td className="p-3">{expense.method}</td>
                <td className="p-3">{expense.category}</td>
                <td className="p-3">₹{expense.amount}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
            <input
              type="text"
              placeholder="Payment Method"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
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
                className="bg-gray-300 text-white py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleAddExpense}
              >
                {editIndex !== null ? 'Update' : 'Add'} Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Report */}
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
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
