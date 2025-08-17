import { useState } from "react";
import { useSignInEmailPassword } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { nhost } from "../lib/nhost";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { signInEmailPassword, isLoading, isError, error } =
    useSignInEmailPassword();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await nhost.auth.signOut();
    const res = await signInEmailPassword(email, password);

    if (res.isSuccess) {
      navigate("/dashboard");
    }

    if (res.isSuccess || res.error?.error === "already-signed-in") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="signin">
      <h2>Sign In</h2>
      <form className="signinform" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <div className="showpasswordCheckbox">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <label>Show password</label>
        </div>

        <button className="signInSubmit" type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="signnuppage">
        <p>Don't have an account?</p>
        <button className="signUpInSignIn" onClick={() => navigate("/sign-up")}>
          Sign Up
        </button>
      </div>

      <div className="signinmessage">
        {isError && <p style={{ color: "red" }}>{error?.message}</p>}
      </div>

      <div className="demo-credentials">
        <h4 className="demo-title">Test Users for Demo:</h4>
        <div className="demo-user">
          <span>
            <strong>Email:</strong> <code>muralikrishna1502887@gmail.com</code>
          </span>
          <span>
            <strong>Password:</strong> <code>abcd@1234</code>
          </span>
        </div>
        <p className="demo-note">
          <em>
            Use these credentials to log in and test the chatbot features
            instantly.
          </em>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
