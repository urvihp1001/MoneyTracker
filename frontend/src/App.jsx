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
  }

}
export default App;