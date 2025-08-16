import { useState } from "react";
import { useSignUpEmailPassword } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { signUpEmailPassword, isLoading, isError, error } =
    useSignUpEmailPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await signUpEmailPassword(email, password, {
      displayName: `${firstName} ${lastName}`.trim(),
    });

    if (res.isSuccess) {
      // navigate only if you want
      navigate("/");
    } else if (res.isError) {
      alert("SignUp failed");
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form className="signupform" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="signinpage">
        <p>Already have an account?</p>
        <button onClick={() => navigate("/")}>Sign In</button>
      </div>
      {isError && <p style={{ color: "red" }}>{error?.message}</p>}
    </div>
  );
}

export default SignUp;
