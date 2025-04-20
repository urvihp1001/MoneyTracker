const { useState, useEffect } = require("react");
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];
function App()
{
  const [expenses, setExpenses]=useState([
    {
      name:'Atta',
      method:'Card',
      category:'Groceries',
      amount:1200,
      date:'2025-04-15'
    },
    {
      name:'Zerodha',
      method:'UPI',
      category:'Urvi',
      amount:1000,
      date:'2025-04-18'
    },
    {
      name:'Carrot',
      method:'UPI',
      category:'Vegetable',
      amount:300,
      date:'2025-04-15'
    }
  ]);
  const [filteredExpenses, setFilteredExpenses]=useState(expenses); //initially d=filter from expenses doc
  const [searchTerm, setSearchTerm]=useState(''); //useState is initial state
  const [showModal, setShowModal]=useState(false);
  const [showReport, setShowReport]=useState(false);
  const [editIndex, setEditIndex]=useState(null)
  const [formData, setFormData]=useState({
    name:'',
      method:'',
      category:'',
      amount:'',//enter as string- convert to number in handleAddExpense
      date:''
  });

  //useEffect- performs side effects - actions not included in rendering like fetching data

  useEffect(()=>{
    setFilteredExpenses(expenses)
  },[expenses]);

  const handleSearch=()=>{
    const filtered=expenses.filter(
      (expense)=>
        expense.name.toLowerCase().includes(searchTerm.toLowerCase())||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())||
        expense.method.toLowerCase().includes(searchTerm.toLowerCase())  //show name,category, method that contains search term
    );
    setFilteredExpenses(filtered);
  };

  const handleAddExpense=()=>
  {
    if(editIndex!==null){ //edit is false, so add as new value  
      const updated=[...expenses];
      updated[editIndex]={...formData,amount:Number(formData.amount)};
      setExpenses(updated);
      setEditIndex(null);
    }else{
      setExpenses([...expenses,{...formData,amount:Number(formData.amount)}]);
      //... passing props to component
    }
    setFormData({name:'',method:'',category:'',amount:'',date:''});
    setShowModal(false);
  };
  
  const handleDelete=(index)=>{
    const updated=[...expenses];
    updated.splice(index,1);//delete 1 element (2nd arg) from index onw and replace w new element optionally
    setExpenses(updated); 
  };

  const handleEdit=(index)=>{
    setFormData(filteredExpenses[index]);
    const originalIndex=expenses.findIndex(
      (item)=>item.name===filteredExpenses[index].name&&item.date===filteredExpenses[index].date
    );
    setEditIndex(originalIndex)
    setShowModal(true)
  }

  const categoryData=Object.values(
    expenses.reduce((acc,curr)=>{
      acc[curr.category]=acc[curr.category]||{name:curr.category,value:0}
      acc[curr.category].value+=curr.amount;
      return acc;
    },{})
  );
  return (
    <div className="flex flex-col justify-center items-center mt-[3%] w-[80%] mx-auto">
      <h1 className="text-2xl font-medium text-[#555]">Expense Tracker</h1>

      <div className="flex items-center justify-between mt-5 w-full">
        <div className="flex justify-between w-[300px]">
          <button
          className="bg-red-400 p-[10px] border-none outline-none cursor-pointer text-white text-medium"
          onClick={()=>{
            setFormData({name:'',method:'',category:'',amount:'',date:''});
            setEditIndex(null);
            setShowModal(true);
          }}
          >Add Expense</button>
           <button
          className="bg-blue-600 p-[10px] border-none outline-none cursor-pointer text-black text-medium"
          onClick={()=>{
            setShowReport(!showReport)
          }}>Expense Report</button>

</div>
<div className="ml-auto flex gap-2">
  <input type="text" placeholder="Search Expenses..."
  className="border border-gray-300 rounded-md p-2 w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400"
  value={searchTerm}
  onChange={(e)=>setSearchTerm(e.target.value)}
  />
  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  onClick={handleSearch}>Search</button>

  </div>
</div>
<div className="w-ful mt-8">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider">
      <th className="p-3">Date</th>
        <th className="p-3">Name</th>
        <th className="p-3">Method</th>
        <th className="p-3">Category</th>
        <th className="p-3">Amount</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredExpenses.map((expenses,index)=>(
                     <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{expense.date}</td>
                      <td className="p-3">{expense.name}</td>
                      <td className="p-3">{expense.method}</td>
                      <td className="p-3">{expense.category}</td>
                      <td className="p-3">{expense.amount}</td>
                      <td className="p-3">{expense.actions}</td>
                     <td> <button className="text-sm text-blue-600 hover:underline"
                      onClick={()=>handleEdit(index)}
                      >Edit</button></td>
                     <td> <button className="text-sm text-red-600 hover:underline"
                      onClick={()=>handleDelete(index)}>Delete</button></td>
                     </tr>
      

      ))}
    </tbody>
  </table>
</div>
{/*Modal */}
{
  showModal &&(
<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-10">
<div className="bg-white p-6 rounded-lg w-[400px]">
  <h2 className="text-xl font-semibold mb-4">{editIndex!==null?'Edit':'Add'} Expense</h2>
  <input type="text" placeholder="Date" value={formData.date}
  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                className="w-full mb-2 p-2 border rounded"/>
                  <input type="text" placeholder="Date" value={formData.date}
  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                className="w-full mb-2 p-2 border rounded"/>
                  <input type="text" placeholder="Date" value={formData.name}
  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                className="w-full mb-2 p-2 border rounded"/>
                  <input type="text" placeholder="Date" value={formData.method}
  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                className="w-full mb-2 p-2 border rounded"/>
                  <input type="text" placeholder="Date" value={formData.category}
  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                className="w-full mb-2 p-2 border rounded"/>
                  <input type="text" placeholder="Date" value={formData.amount}
  onChange={(e)=>setFormData({...formData,name:e.target.value})}
                className="w-full mb-2 p-2 border rounded"/>
                <div className="flex justify-end gap-3">
                  <button
                  onClick={()=>{setShowModal(false);setEditIndex(null);}}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >Cancel</button>
                </div>
  </div>
</div>
  )}
</div>
  );

}
export default App;