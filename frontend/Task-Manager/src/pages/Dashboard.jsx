import React, { useState ,useEffect } from 'react'
import axios from "axios"
import './dashboard.css'
import { handleDelete, handleTask } from '../apis/axios'
export default function Dashboard() {
  const [showTask , setShowTask] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title ,setTitle]=useState("")
  const [description,setDescription] = useState("")
  const [priority,setPriority] = useState("Low")
  const [dueDate,setDueDate] = useState("")
  const [tasks, setTasks] = useState([])
  const [editingId , setEditingId] = useState(null)
  const [search , setSearch]= useState("")

//logout
const handleLogout = ()=>
{
  localStorage.removeItem("token");
  window.location.href = "/"
}

//searching
const getFilterItems = (search, items)=>
{
  if(!search){
    return items
  }
  return items.filter((t)=> t.title.toLowerCase().includes(search.toLowerCase()))
  
}

//reading task
const getTask = async()=>
  {
     try{
         const data=  await handleTask()
         setTasks(data)
     }
     catch(error)
     {
      console.log(error)
     }
  }
  useEffect(()=>
  {
    getTask()
  },[])



//deleting task
const deleteTask = async(id)=>
  {
    try{
        await handleDelete(id)
       setTasks(tasks.filter(task => task._id !== id)
    )

    }
    catch(error)
    {
      console.log(error)
    }
  }


//adding task
const  addTask = async (e)=>
    {
        e.preventDefault()
        const token = localStorage.getItem("token") 
       console.log("Token from localStorage:", token)

    if (!token) {
        alert("You are not logged in. Please login again.")
        window.location.href = "/"
        return
    }
        if(title.trim()==="")
        {
          alert("please enter a title")
          return
        }
        const newTask = 
        {
            title : title,
            description: description,
            priority : priority,
            dueDate : dueDate
        }
        try{ // editing task
          if (editingId){
            const token = localStorage.getItem("token")
            const response = await axios.put(`http://localhost:8000/api/tasks/${editingId}`,newTask , {headers:{Authorization:`Bearer ${token}`}})
            setTasks(tasks.map(task =>task._id === editingId ? response.data : task))
            setEditingId(null)
          }
          else
          {
              const token = localStorage.getItem("token")
              console.log("TOKEN:", token)
              const response = await axios.post( "http://localhost:8000/api/tasks",newTask,{headers : {Authorization: `Bearer ${token}`}})
              setTasks([...tasks,response.data])
          }
           //clear form
            setTitle("")
            setDescription("")
            setPriority("Low")
            setDueDate("")
            setShowForm(false)
        }
        catch(error)
        {
          console.log(error)
          console.log("STATUS:", error.response?.status)
          console.log("DATA:", error.response?.data)
          console.log("ERROR:", error)
        }      
    }

//editing task
const editTask = (task)=>
    {
      console.log("clicked ")
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setDueDate(dueDate)
      setEditingId(task._id)
      setShowForm(true)
    }
    //marking complte
    const markComplete = async(task)=>
    {
      
      const newStatus = task.status ==="Completed" ? "Pending" : "Completed"
      try{
        const token = localStorage.getItem("token")
        const response = await axios.put(`http://localhost:8000/api/tasks/${task._id}`,{
          status : newStatus},{headers : {Authorization: `Bearer ${token}`}})
          setTasks(tasks.map(item=>item._id === task._id ?response.data :item))
      }
      catch(error)
      {
        console.log(error)
      }
    } 
  return (
    <div>
      <header className="header">
        <h1>Task Manager</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="task-actions">
        <div className="searchTask">
          <input
            type="text"
            placeholder="Search Tasks..."
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
          />
        </div>
        <button
          className="add-task"
          onClick={() => setShowForm(true)}
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <div className="small-container">
          <h2>{editingId ? "Edit Task" : "Add Task"}</h2>
          <form onSubmit={addTask}>
            <label>Title</label>
          <input type="text" placeholder="Enter task title" value= {title} onChange={(e)=>setTitle(e.target.value)}/>
          <label>Description</label>
          <textarea placeholder="Enter task description" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e)=> setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)}/>
          <div className="form-button">
            <button className="btn">{editingId ? "Update Task":"Add Task"}</button>
            <button
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >Cancel</button>
          </div>
          </form>
        </div>
       )}
         {showTask && <div className='task-list'>
            {tasks.map((task,index)=>
            {
                return(
                    <div className='task-card' key={task._id}>
                    <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <span>{task.status}</span>
                    </div>
                    <div>
                            <span>{task.priority}</span>
                            <button className='mark-complte' onClick={()=>markComplete(task)}>{task.status === "Completed" ? "Mark Pending":"Mark Completed"}</button>
                            <button onClick={()=>editTask(task)}>Edit</button>
                            <button onClick={()=>deleteTask(task._id)} className='dlt-button'> Delete</button>
                    </div>
                </div>
                )
                
            })}

        </div>}
       
    </div>
  )
}