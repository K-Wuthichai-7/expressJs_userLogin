// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Users } from './page/Users';
// import { Login } from './page/Login';

// function App() {

//   return (
//     <Router>
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/users" element={<Users />} />
//     </Routes>
//   </Router>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Users } from './page/Users';
import { Login } from './page/Login';
import ProtectedRoute from './ProtectedRoute ';

function App() {
  return (
    <Router>
      <Routes>
        {/* เส้นทางสำหรับหน้า Login */}
        <Route path="/" element={<Login />} />

        {/* เส้นทางสำหรับหน้า Users (ป้องกันการเข้าถึง) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

