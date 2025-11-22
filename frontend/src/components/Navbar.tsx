import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        backgroundColor: "#20232a",
        color: "white"
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontWeight: "bold" }}>SuperHero Manager</span>
        <Link style={{ color: "white", textDecoration: "none" }} to="/">
          Accueil
        </Link>
        <Link style={{ color: "white", textDecoration: "none" }} to="/admin">
          Admin
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "0.75rem" }}>{user.email} ({user.role})</span>
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        ) : (
          <Link style={{ color: "white", textDecoration: "none" }} to="/login">
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  );
}
