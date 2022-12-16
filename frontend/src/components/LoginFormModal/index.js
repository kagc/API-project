// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          console.log(data.errors)
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  const demoLogin = (e) => {
    e.preventDefault();
    const demo = {
        credential: 'Demo-lition',
        password: 'password'
    }
    return dispatch(sessionActions.login(demo)).then(closeModal)
  }

  return (
    <div className='login-holder'>
      <div className='login-line-holder'>

      <h1 className='login-line'>Log in</h1>
      </div>

      <div className='welcome'> Welcome to Sparebnb</div>

    <div className='form-holder'>

      <form className='login-form-css' onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
          <div className='input-holder'>
        <label>
          
          <input
          className='input-line'
            type="text"
            value={credential}
            placeholder='Username or Email'
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          
          <input
            type="password"
            className='input-line'
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>
        <button type="submit">Log In</button>
      </form>

            <div className='form-holder'>
               <form className='login-form-css' onSubmit={demoLogin}>
      <button type="submit">Demo User Login</button>
    </form>
            </div>
     
    </div>
    </div>
  );
}

export default LoginFormModal;

