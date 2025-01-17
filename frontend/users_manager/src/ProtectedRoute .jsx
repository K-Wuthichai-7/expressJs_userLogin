import React from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ตรวจสอบว่า token 

  if (!token) {
    // ถ้าไม่มี token ให้ไปหน้า Login
    return <Navigate to="/" />;
  }

  // ถ้ามี token ให้แสดงหน้าที่ถูกป้องกัน
  return children;
};

export default ProtectedRoute;
