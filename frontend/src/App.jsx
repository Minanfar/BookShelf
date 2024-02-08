import { useEffect, useState } from "react";
import cookie from "js-cookie";
import axios from "axios";
import "./App.css";

function App() {
  const [hasToken, setHasToken] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState({});

  const url = "http://localhost:3003";
  const setErrorMessages = (error) => {
    if (error.response) {
      setError(error.response.data.error);
    } else {
      setError(error.message);
    }
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const resp = await axios.post(`${url}/register`, { email, password });
      console.log("You are Registerd!Frontend", resp.data);
      console.log("form",resp);
    } catch (error) {
      console.log("problem in register,error:", error);
      console.log("error while signing up:", error.message);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const resp = await axios.post(
        `${backendApiUrl}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setMsg(`Erfolgreich eingeloggt: ${email}. JWT erhalten.`);

      setHasToken(true);
      setUser({ email });
    } catch (error) {
      setErrorMessages(error);
      console.log("error while logging in:", error);
    }
  };

  const logoutHandler = async (e) => {
    e.preventDefault();

    resetMessages();

    try {
      const resp = await axios.post(
        `${url}/logout`,
        {},
        { withCredentials: true }
      );

      console.log("Erfolgreich ausgeloggt", resp.data);
      setMsg("Erfolgreich ausgeloggt.");
      setHasToken(false);
    } catch (error) {
      setErrorMessages(error);
    }
  };

  const handleIfUserHasToken = () => {
    let JWTinfocookie = cookie.get("JWTinfo");
    console.log("JWTinfo cookie", JWTinfocookie);
    if (!JWTinfocookie) return;

    const cookieValueObj = JSON.parse(JWTinfocookie);

    const expirationInMs = new Date(cookieValueObj.expires) - new Date();
    console.log("JWT läuft ab in", expirationInMs / 1000, "Sekunden");

    if (expirationInMs <= 0) return;

    setHasToken(true);
    setUser({ email: cookieValueObj.email });
    setMsg(`Eingeloggter User: ${cookieValueObj.email}.`);
  };

  const userInfoHandler = async () => {
    resetMessages();

    try {
      const resp = await axios.get(`${url}/userinfo`, {
        withCredentials: true,
      });
      console.log("resp.data:", resp.data);
      setMsg(resp.data);
    } catch (error) {
      setErrorMessages(error);
    }
  };

  useEffect(() => {
    handleIfUserHasToken();
  }, []);

  return (
    <>
      <h2> {hasToken ? "User loggedin" : "User is not logged"} </h2>
      <p className='info'>
        <span style={{ color: "red" }}>{error}</span> <span>{msg}</span>
      </p>

      {!hasToken ? (
        <>
          <h2>Register</h2>
          <form onSubmit={signUpHandler}>
            <label htmlFor='email'>Email: </label>
            <input type='email' name='email' />
            <br />
            <label htmlFor='password'>Password: </label>
            <input type='password' name='password' />
            <br />
            <button type='submit'>Register</button>
          </form>

          <hr />
          <h2>Login</h2>
          <form onSubmit={loginHandler}>
            <label htmlFor='email'>Email: </label>
            <input type='email' name='email' />
            <br />
            <label htmlFor='password'>Password: </label>
            <input type='password' name='password' />
            <br />
            <button type='submit'>Log In</button>
          </form>
        </>
      ) : (
        /*Ohne Token, also nicht eingeloggt:*/
        <>
          <hr />
          <form onSubmit={logoutHandler}>
            <button type='submit'>Logout</button>
          </form>
        </>
      )}
      <hr />
      <button onClick={userInfoHandler}>Zeige persönliche Daten</button>
    </>
  );
}

export default App;
