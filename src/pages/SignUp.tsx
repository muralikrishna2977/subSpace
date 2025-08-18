import { useState } from "react";
import { useSignUpEmailPassword } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import { nhost } from "../lib/nhost";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false); // ✅ our own state
  const navigate = useNavigate();

  const { signUpEmailPassword, isLoading } = useSignUpEmailPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await nhost.auth.signOut();

    const res = await signUpEmailPassword(email, password, {
      displayName: name.trim(),
    });

    // ✅ In email verification mode, res.isSuccess will be false
    // ✅ But as long as it's not an error, it means "signup accepted"
    if (!res.isError) {
      setSignupSuccess(true);
    } else {
      alert(res.error?.message || "Signup failed");
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form className="signupform" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />

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

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="signinpage">
        <p>Already have an account?</p>
        <button onClick={() => navigate("/")}>Sign In</button>
      </div>

      {signupSuccess && (
        <p style={{ color: "green" }}>
          Signup successful! A verification email has been sent. <br />
          If you don’t see it, please check your Spam or Junk folder.
        </p>
      )}
    </div>
  );
}

export default SignUp;
