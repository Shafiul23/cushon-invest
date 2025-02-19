import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css";
import { useAuth } from "../../context/AuthContext";

interface Transaction {
  id: number;
  fund: string;
  amount: number;
  timestamp: string;
}

const Portfolio = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { username } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT token
        if (!token) throw new Error("User not authenticated");

        const res = await fetch("http://127.0.0.1:5000/auth/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.welcome}>Welcome, {username || "User"}!</h2>

      <h3 className={styles.heading}>Your Transactions</h3>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Fund</th>
              <th>Amount (£)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.fund}</td>
                  <td>{tx.amount}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
