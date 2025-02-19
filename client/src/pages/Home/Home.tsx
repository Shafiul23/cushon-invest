import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const { userId } = useAuth();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Cushon</h1>
      <p className={styles.subtitle}>
        Smart workplace savings and pension solutions, now available to
        individual investors.
      </p>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Easy ISA Setup</h3>
          <p>Setting up an ISA and getting decent returns shouldn't be hard.</p>
        </div>
        <div className={styles.card}>
          <h3>Retirement Savings Made Easy</h3>
          <p>
            Many people don't save enough for retirement. Cushon aims to help
            solve this issue.
          </p>
        </div>
        <div className={styles.card}>
          <h3>Investment Made Simple</h3>
          <p>We provide a smooth and secure process to grow your savings.</p>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {!userId ? (
          <>
            <Link to="/register" className={styles.buttonPrimary}>
              Register
            </Link>
            <Link to="/login" className={styles.buttonPrimary}>
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/invest" className={styles.buttonPrimary}>
              Invest
            </Link>
            <Link to="/portfolio" className={styles.buttonPrimary}>
              Portfolio
            </Link>
            <Link to="/profile" className={styles.buttonPrimary}>
              Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
