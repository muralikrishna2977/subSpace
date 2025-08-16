// RequireAuth.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthenticationStatus } from "@nhost/react";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const location = useLocation();

  // Wait while Nhost restores session (prevents 401 on reload)
  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  // If not logged in, send to SignIn and remember where they tried to go
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Auth ready → render protected content
  return <Outlet />;
}
