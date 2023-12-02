import "../login/Login.css";
export default function LoginPage() {
  return (
    <section>
      <div className="pageAuth">
        <img
          className="logo"
          src="src\assets\logo2.svg"
          alt="logo greenclean"
        />
        <p className="underLogo">
          Join now for a cleaner, greener home and embrace sustainable living
          effortlessly with our app!
        </p>
        <h1>Login</h1>
        <form action="" className="formLogin">
          <input type="email" name="mail" placeholder="Type your mail" />
          <input
            type="password"
            name="password"
            placeholder="Type your password"
          />
          <button className="ctaA">
            Login <img src="src\assets\fi-rr-angle-right.svg" alt="arrow" />
          </button>
        </form>
        <p className="text-center">Dont have an account?Sign Up</p>
      </div>
    </section>
  );
}
