import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getMe } from "../api";
import { useNavigate } from "react-router-dom";

type Me = {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
};

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getMe();
        setMe(res.data);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch profile");
        }
      }
    };
    run();
  }, []);

  const signOut = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        <p className="mt-1 text-sm text-secondary-300">View your account information and sign out.</p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-semibold text-white">Basic Information</h3>
            <div className="mt-4 space-y-2 text-sm text-secondary-200">
              {error && <div className="text-danger-400">{error}</div>}
              <div>
                <span className="text-secondary-400">Full Name:</span>{" "}
                <span className="text-secondary-100">{me?.full_name ?? "—"}</span>
              </div>
              <div>
                <span className="text-secondary-400">Username:</span>{" "}
                <span className="text-secondary-100">{me?.username ?? "—"}</span>
              </div>
              <div>
                <span className="text-secondary-400">Email:</span>{" "}
                <span className="text-secondary-100">{me?.email ?? "—"}</span>
              </div>
              <div>
                <span className="text-secondary-400">Member Since:</span>{" "}
                <span className="text-secondary-100">
                  {me?.created_at ? new Date(me.created_at).toLocaleString() : "—"}
                </span>
              </div>
              <div>
                <span className="text-secondary-400">Status:</span>{" "}
                <span className="text-secondary-100">{me?.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="danger" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
