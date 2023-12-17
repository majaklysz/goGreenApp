import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../../firebase-config";
import { useState } from "react";
import "../login/Login.css";
import Logo2 from "../../assets/icons/logo2.svg";
import ArrowIcon from "../../assets/icons/fi-rr-angle-right.svg";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const navigate = useNavigate();

  function signIn(e) {
    e.preventDefault();
    const mail = e.target.mail.value;
    const password = e.target.password.value;

    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        //signed in
        const user = userCredential.user;
        console.log(user); //test
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

  const isDisabled = !email || !password;
  return (
    <section>
      <div className="pageAuth">
        <img className="logo" src={Logo2} alt="logo greenclean" />
        <p className="underLogo">
          Join now for a cleaner, greener home and embrace sustainable living
          effortlessly with our app!
        </p>
        <h1>Login</h1>
        <form onSubmit={signIn} className="formLogin">
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
            Login
            <img src={ArrowIcon} />
          </button>
        </form>
        <p className="text">
          Dont have an account?
          <Link to="/sign-up"> Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
