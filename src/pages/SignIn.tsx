import { useState } from "react";
import { useSignInEmailPassword } from "@nhost/react";
import { useNavigate } from "react-router-dom";
import "./SignIn.scss";

function SignIn() {
  const [email, setEmail] = useState("muralikrishna1502887@gmail.com");
  const [password, setPassword] = useState("Pilot@1502887#");

  const navigate = useNavigate();

  const {
    signInEmailPassword,
    isLoading,
    isError,
    error
  } = useSignInEmailPassword();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await signInEmailPassword(email, password);

    if (res.isSuccess) {
      navigate("/dashboard");
    }

    if (res.isSuccess || res.error?.error === 'already-signed-in') {
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button className="signInSubmit" type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="signnuppage">
        <p>Don't have an account?</p>
        <button className="signUpInSignIn" onClick={() => navigate("/sign-up")}>Sign Up</button>
      </div>

      <div className="signinmessage">
        {isError && <p style={{ color: "red" }}>{error?.message}</p>}
      </div>

    </div>
  );
}

export default SignIn;
