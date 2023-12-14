import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signUp/SignupPage";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./pages/home/Home";
import NavBottom from "./assets/components/navBottom/NavBottom";
import NavTop from "./assets/components/NavTop/NavTop";
import AddingRoomPage from "./pages/addingRoom/AddingRoomPage";
import RoomPage from "./pages/roomPage/RoomPage";
import AddingTaskPage from "./pages/addingTasks/AddingTaskPage";
import DailyListPage from "./pages/dailyList/DailyListPage";
import RoomEdit from "./pages/roomSettings/RoomEdit";
import TaskEditPage from "./pages/taskEdit/TaskEditPage";
import RecipesPage from "./pages/recipesPage/RecipesPage";
import RecipePage from "./pages/recipePage/RecipePage";
import ProfilePage from "./pages/profilepage/ProfilePage";

export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); // start default value comes from localStorage
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        //user is authenticated / signed in
        setIsAuth(true); // set isAuth to true
        localStorage.setItem("isAuth", true); // also, save isAuth in localStorage
      } else {
        // user is not authenticated / not signed in
        setIsAuth(false); // set isAuth to false
        localStorage.removeItem("isAuth"); // remove isAuth from localStorage
      }
    });
  }, []);

  const privateRoutes = (
    <>
      <NavTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addRoom" element={<AddingRoomPage />} />
        <Route path="/:roomId" element={<RoomPage />} />
        <Route path="/addTask/:roomId" element={<AddingTaskPage />} />
        <Route path="/editRoom/:roomId" element={<RoomEdit />} />
        <Route path="/dailyList" element={<DailyListPage />} />
        <Route path="/editTask/:taskId" element={<TaskEditPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:recipeId" element={<RecipePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <NavBottom />
    </>
  );
  const publicRoutes = (
    <>
      <Routes>
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/log-in" />} />
      </Routes>
    </>
  );

  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}
