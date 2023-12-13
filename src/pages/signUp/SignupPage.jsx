import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../../firebase-config";
import "../signUp/signup.css";

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const auth = getAuth(app);
  const navigate = useNavigate();

  function handleSignUp(e) {
    e.preventDefault();
    const mail = e.target.mail.value;
    const password = e.target.password.value;

    createUserWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        //signed in
        const user = userCredential.user;
        console.log(user);
        createUser(user.uid, mail);
      })
      .catch((error) => {
        let code = error.code; // saving error code in variable
        console.log(code);
        code = code.replaceAll("-", " "); // some JS string magic to display error message. See the log above in the console
        code = code.replaceAll("auth/", "");
        setErrorMessage(code);
      });
    navigate("/");
  }
  async function createUser(uid, mail) {
    const url = `${import.meta.env.VITE_FIREBASE_DB_URL}/users/${uid}.json`;
    const points = 0; // Default points value
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ name, mail, points }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("New user created: ", data);
    } else {
      console.log("Sorry, something went wrong");
    }
  }

  const isDisabled = !name || !email || !password;

  return (
    <section>
      <div className="pageAuth">
        <img
          className="logo"
          src="/src/assets/icons/logo2.svg"
          alt="logo greenclean"
        />
        <p className="underLogo">
          Join now for a cleaner, greener home and embrace sustainable living
          effortlessly with our app!
        </p>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp} className="formLogin">
          <div className="intBox">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              placeholder="Type your name"
            />
          </div>
          <div className="intBox">
            <label>Mail</label>
            <input
              type="email"
              name="mail"
              placeholder="Type your mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="intBox">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-error">{errorMessage}</p>
          <button
            disabled={isDisabled}
            className={isDisabled ? "gray-button" : "ctaA"}
          >
            Sign Up
            <img src="/src/assets/icons/fi-rr-angle-right.svg" alt="arrow" />
          </button>
        </form>
        <p className="text">
          Already have an account? <Link to="/log-in"> Login</Link>
        </p>
      </div>
    </section>
  );
}
