import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth();

  function login(event) {
    event.preventDefault();
    const mail = event.target.mail.value; // mail value from inout field in sign in form
    const password = event.target.password.value; // password value from inout field in sign in form

    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user); // for test purposes: logging the authenticated user
      })
      .catch((error) => {
        let code = error.code; // saving error code in variable
        console.log(code);
        code = code.replaceAll("-", " "); // some JS string magic to display error message. See the log above in the console
        code = code.replaceAll("auth/", "");
        setErrorMessage(code);
      });
  }
  return (
    <section className="page">
      <img src="src\assets\logo2.svg" alt="logo GreenClean" />
      <p>
        Join now for a cleaner, greener home and embrace sustainable living
        effortlessly with our app!
      </p>
      <h1>Login</h1>
      <form onSubmit={login}>
        <input type="email" name="mail" placeholder="Type your mail" />
        <input
          type="password"
          name="password"
          placeholder="Type your password"
        />
        <p className="text-error">{errorMessage}</p>
        <button>Sign in</button>
      </form>
      <p className="text-center">
        Dont have an account? <Link to="/sign-up">Sign Up</Link>
      </p>
    </section>
  );
}
