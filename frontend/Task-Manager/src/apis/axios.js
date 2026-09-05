import axios from "axios";

//reading task

export const handleTask = async ()=>
    {
        const token = localStorage.getItem("token")
         const response = await axios.get("http://localhost:8000/api/tasks",{ headers :{
            Authorization : `Bearer ${token}`
         }})
         return response.data
    } 
export const handleDelete = async (id)=>
{
    const token = localStorage.getItem("token")
    const response  = await axios.delete(`http://localhost:8000/api/tasks/${id}` ,{headers:{Authorization:  `Bearer ${token}`}})
    return response.data
}
