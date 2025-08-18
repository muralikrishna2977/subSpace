import { useState } from "react";
import { useSignInEmailPassword } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { nhost } from "../lib/nhost";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signInEmailPassword, isLoading } = useSignInEmailPassword();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setCustomError(null);

    await nhost.auth.signOut();

    const res = await signInEmailPassword(email, password);
    console.log("Sign in response:", res);

    if (res.isSuccess || res.error?.error === "already-signed-in") {
      navigate("/dashboard");
    } else if (res.needsEmailVerification) {
      // setCustomError("Please verify your email before logging in. Check your inbox or spam folder.");
      setCustomError("email");
    } else if (res.isError) {
      setCustomError(res.error?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1>Welcome to the ChatBot</h1>

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
          <label>Don't have an account?</label>
          <button className="signUpInSignIn" onClick={() => navigate("/sign-up")}>
            Sign Up
          </button>
        </div>

        {customError && (
          <div className="signinmessage">
            {customError === "email" ? (

              <p className="verify-message">
                Please 
                <span className="highlight"> verify your email </span> before logging in. Check your 
                <span className="highlight"> inbox</span> or 
                <span className="highlight"> spam folder</span>.
              </p>

            ) : (
              <p style={{ color: "red" }}>{customError}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default SignIn;
