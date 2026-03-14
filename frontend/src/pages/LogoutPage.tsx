import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // clear any auth tokens here when implemented
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
}
