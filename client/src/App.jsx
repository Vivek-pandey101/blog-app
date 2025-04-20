import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import AllPosts from "./pages/AllPosts";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
      <Route path="/" element={<AllPosts/>} />
      <Route path="/posts/:id" element={<PostDetails />} />
      <Route path="/edit/:id" element={<EditPost />} />
      {/* Other routes */}
    </Routes>
  );
}

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
};

export default App;
