
import { useState,useEffect } from "react";
import { CreateUser } from "./CreateUser";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
export const Users = () => {

    //Redirect
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    console.log(data);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get('http://localhost:3000/getUsers')
        .then(response => {
          setData(response.data.results);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;



  // ฟังก์ชันlogout
  const handleLogout = () => {
    // ลบ token ออกจาก localStorage
    localStorage.removeItem('token');
    
  // เปลี่ยนไปยังหน้า Login
    navigate('/');
  };


  return (
    <>
 <CreateUser  setData={setData}/>
<div>

   {/* Add New User Modal End  */}
  <div className="container">
    <div className="row mt-4">
      <div className="col-lg-12 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="text-primary">All users in the database!</h4>
        </div>
        <div>
        <button type="button" className="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#createUserModal">
          เพิ่มผู้ใช้งานใหม่
        </button>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>

        </div>
      </div>
    </div>
    <hr />
    <div className="row">
      <div className="col-lg-12">
        <div id="showAlert" />
      </div>
    </div>
    <div className="row">
      <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
               
              </tr>
            </thead>
            <tbody>
            {data && data.length > 0 ? (
                data.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.full_name}</td>
                    <td>{item.email}</td>
                 
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>


    </>
  )
}
