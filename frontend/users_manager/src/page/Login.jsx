import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


export const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


   // Redirect
   const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {

      const response = await axios.post('http://localhost:3000/login', { email, password });

      // ถ้าล็อกอินสำเร็จ
      console.log(response.data.message); 

      // เก็บ token ลงใน localStorage
      localStorage.setItem('token', response.data.token);
      
      //Redirect to Users page
      navigate('/users');
      alert('Login successful!');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message); 
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };
// style={{boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px ' ,border:'1px solid red'
  return (
    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="container " >
        <div className="row " style={{height:'400px',}}>
          <div className="col" />
          <div 
          className="col-md-5 p-3" 
          style={{
            display: "flex", 
            justifyContent: 'center', alignItems: 'center',
            boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px ',
         
          }} >

           <div style={{width:'100%',height:'100%',position:'relative'}}>
           <form onSubmit={handleSubmit} >
              <h1 className="h3 mb-3 fw-normal text-center">Please sign in</h1>
              
              {/* Input  Email */}
              <div className="form-floating mt-5 mb-4">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>

              {/* Input  Password */}
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control mb-4"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              {/* แสดงข้อผิดพลาด */}
              {errorMessage && <div className="text-danger">{errorMessage}</div>}

              <button style={{position:'absolute'}} className="btn btn-primary w-100 py-2 fixed-bottom" type="submit">Sign in</button>
            </form>
           </div>
          </div>
          <div className="col" />
        </div>
      </div>
    </div>
  );
};
