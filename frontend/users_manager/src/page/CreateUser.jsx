import React, { useState } from 'react';
import axios from 'axios';

export const CreateUser = ({setData}) => {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault(); // Prevents the page from reloading
    console.log('Data to be sent:', formData);

    const data = JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/insertUser',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log('Response:', response.data);

      if (response.status === 201) {
        const usersResponse = await axios.get('http://localhost:3000/getUsers'); 
        setData(usersResponse.data.results); // Update users 
        alert('ผู้ใช้งานถูกสร้างเรียบร้อยแล้ว');
          // Fetch updated users data
        

        // Clear form
        setFormData({
          name: '',
          email: '',
          password: ''
        });
        // Close modal using Bootstrap
        const modal = document.getElementById('createUserModal');
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal?.hide();
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };


//   const fetchData = () => {
    
//     useEffect(() => {
//         axios.get('http://localhost:3000/getUsers')
//           .then(response => {
//             setData(response.data.results);
//           })
//           .catch(error => {
//             console.log(error)
//           });
//       }, []);
//   }
  return (
    <>
      {/* <!-- Modal --> */}
      <div className="modal fade" id="createUserModal" tabIndex={-1} aria-labelledby="createUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createUserModalLabel">เพิ่มผู้ใช้งานใหม่</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <form id="createUserForm">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">ชื่อผู้ใช้</label>
                  <input type="text"
                    className="form-control"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">อีเมล</label>
                  <input type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">รหัสผ่าน</label>
                  <input type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>
              <button onClick={handleSubmit} form="createUserForm" className="btn btn-primary">บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
