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
      <div className={styles.description}>
        <p>
          Born from a simple idea: setting up an ISA and getting decent returns
          shouldn't be hard. With years of experience and innovation, Cushon has
          been at the forefront of workplace pensions and savings. Our CEO, Ben
          Pollard, founded Cushon (formerly Smarterly) after facing frustrations
          with online ISAs. Now, we offer smart, easy-to-use financial products
          for thousands of people to secure their financial future.
        </p>
        <p>
          Looking to start investing? With Cushon, you can invest directly into
          a single fund, like the Cushon Equities Fund. Whether you're just
          starting or have a lump sum to invest, we provide a smooth and secure
          process to make it easy for you to grow your savings.
        </p>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
