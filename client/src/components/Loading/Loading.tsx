import styles from "./Loading.module.css";

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <div className={styles.loadingText}>Loading...</div>
      <div className={styles.text}>
        If the server hasn't been used in a while, then it could take a minute
        to spin up again
      </div>
    </div>
  );
}

export default Loading;
