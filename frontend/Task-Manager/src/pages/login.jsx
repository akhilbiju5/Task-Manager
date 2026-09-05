import React, { useState } from 'react'
import './login.css'
import { useNavigate } from "react-router-dom"
import axios from "axios"
function Login() {

  const [mode, setMode] = useState("login")
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const[email ,setEmail]=useState("")
  const[confirmPassword ,setConfirmPassword] = useState("")
  const[password ,setPassword]= useState("")
  const handleSubmit= async(e)=>
  {
    e.preventDefault()
    if (mode ==="signup")
    {
      if(password != confirmPassword)
      {
        alert("Password do not match")
        return
      }
      try{
        const response = await axios.post("http://localhost:8000/api/auth/register",
          {name, 
            email,
             password,confirmPassword}
        )
        console.log(response.data)
        alert("Registration successful")
        navigate("/dashboard")
        setMode("login")
      }
      catch(error)
      {
        console.log(error)
        alert(error.response?.data?.message || "Registration failed")
      }
    }
    else
    {
      try{
        const response = await axios.post("http://localhost:8000/api/auth/login",{email , password})
        console.log("Full response:", response.data)
        console.log("Token received:", response.data.token)

        localStorage.setItem("token",response.data.token)
        console.log(response.data)
        alert("Login successful")
       navigate("/dashboard")
      }
      catch(error)
      {
        console.log(error)
         alert(error.response?.data?.message || "Login failed")
      }
    }
  }
  return (
    <div className="container">

      <div className="small-box">

        <h1>
          {mode === "login" ? "Login" : "Create an account"}
        </h1>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
              />
            </>
          )}
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            placeholder="Enter your password"
          />

          {mode === "signup" && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
              />
            </>
          )}

          <button type="submit">
            {mode === "login" ? "Login" : "signup"}
          </button>

        </form>

        <div className="para">

          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <span
                className="span"
                onClick={() => setMode("signup")}
              >
                Sign-up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                className="span"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </p>
          )}

        </div>

      </div>

    </div>
  )
}

export default Login