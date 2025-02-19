import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

function Navbar() {
  const { userId, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Error during logout", err);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandPrimary}>Cushon</span>
        </Link>

        <div className={styles.navLinks}>
          <ul className={styles.navList}>
            {userId ? (
              <>
                <li className={styles.navItem}>
                  <Link to="/invest" className={styles.navLink}>
                    Invest
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/portfolio" className={styles.navLink}>
                    Portfolio
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/profile" className={styles.navLink}>
                    Profile
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navItem}>
                  <Link to="/register" className={styles.navLink}>
                    Register
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/login" className={styles.navLink}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
