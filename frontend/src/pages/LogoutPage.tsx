import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
}
