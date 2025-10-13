import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // { token, userId, role }

  if (!user || !user.token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
