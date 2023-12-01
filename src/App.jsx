import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./firebase-config";
import Login from "./pages/login/Login";
import Signup from "./pages/Signup";

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

  // variable holding all private routes including the nav bar
  const privateRoutes = (
    <>
      <Routes></Routes>
    </>
  );

  // variable holding all public routes without nav bar
  const publicRoutes = (
    <Routes>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="*" element={<Navigate to="/sign-in" />} />
    </Routes>
  );

  // if user is authenticated, show privateRoutes, else show publicRoutes
  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}
