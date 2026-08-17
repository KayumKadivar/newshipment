import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Alert, Button, Input } from "antd";
import { useEffect, useRef, useState, type FormEvent } from "react";

import inlandLogo from "../assets/inland1.png";
import nicoLogo from "../assets/nico1.png";

type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (loginTimerRef.current !== null) {
        window.clearTimeout(loginTimerRef.current);
      }
    };
  }, []);

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoggingIn) {
      return;
    }

    if (username === "Test" && password === "Test123") {
      setLoginError("");
      setIsLoggingIn(true);
      loginTimerRef.current = window.setTimeout(() => {
        onLogin();
      }, 3000);
      return;
    }

    setLoginError("Invalid username or password. Please try again.");
  };

  if (isLoggingIn) {
    return (
      <main
        className='login-page login-page--progress'
        aria-label='Login in progress'
        aria-busy='true'
        aria-live='polite'>
        <section className='login-progress-screen'>
          <div className='login-progress-logo'>
            <img src={nicoLogo} alt='NICO' />
          </div>

          <div className='login-progress-row'>
            <div className='login-progress-track' aria-hidden='true'>
              <div className='login-progress-fill' />
              <div className='login-progress-dot' />
            </div>
            <p className='login-progress-status'>SYNCING CARRIER RATES...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='login-page' aria-label='Login page'>
      <section className='login-card' aria-labelledby='login-title'>
        <div className='login-logo' id='login-title'>
          <img src={nicoLogo} alt='NICO' />
        </div>

        <form className='login-form' onSubmit={handleLoginSubmit}>
          {loginError ? (
            <Alert
              className='login-alert'
              type='error'
              message={loginError}
              showIcon
            />
          ) : null}

          <label className='login-field'>
            <span className='login-label'>
              Username <span aria-hidden='true'>*</span>
            </span>
            <Input
              size='large'
              className='login-input'
              placeholder='Enter username'
              autoComplete='username'
              value={username}
              disabled={isLoggingIn}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className='login-field'>
            <span className='login-label'>
              Password <span aria-hidden='true'>*</span>
            </span>
            <Input.Password
              size='large'
              className='login-input login-password-input'
              placeholder='Enter password'
              autoComplete='current-password'
              value={password}
              disabled={isLoggingIn}
              onChange={(event) => setPassword(event.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </label>

          <button className='login-link' type='button'>
            Forgot password?
          </button>

          <Button
            className='login-submit'
            type='primary'
            htmlType='submit'
            size='large'
            loading={isLoggingIn}
            disabled={isLoggingIn}
            block>
            {isLoggingIn ? "Logging in" : "Continue"}
          </Button>

          <div className='login-divider'>
            <span>or</span>
          </div>

          <p className='login-signup'>
            Don&apos;t have an account? <strong>Sign up</strong>
          </p>
        </form>

        <div className='login-footer-logo'>
          <img src={inlandLogo} alt='Inland' />
        </div>
      </section>
    </main>
  );
}

export default Login;
