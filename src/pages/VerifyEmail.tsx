import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { nhost } from "../lib/nhost";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refreshToken = params.get("refreshToken");
    const type = params.get("type");

    if (type === "verifyEmail" && refreshToken) {
      nhost.auth
        .signIn({ refreshToken })
        .then(() => {
          setStatus("Email verified successfully! Redirecting...");
          setTimeout(() => navigate("/dashboard"), 2000);
        })
        .catch((err) => {
          console.error("Verification failed:", err);
          setStatus("Verification failed. Please try logging in.");
          setTimeout(() => navigate("/"), 3000);
        });
    } else {
      setStatus("Invalid verification link.");
      setTimeout(() => navigate("/"), 3000);
    }
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
}

export default VerifyEmail;
