import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { useAuth } from "../../context/AuthContext";
import { Snackbar } from "@mui/material";

const Profile = () => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { username } = useAuth();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch("http://127.0.0.1:5000/auth/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch balance");

        const data = await res.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  const handleAddFunds = async () => {
    if (amount > 50000) {
      setErrorMessage("Amount cannot exceed £50,000");
      setSuccessMessage(null);
      setOpenSnackbar(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const res = await fetch("http://127.0.0.1:5000/auth/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to add funds");

      const data = await res.json();
      setSuccessMessage(data.message || "Funds added successfully!");
      setErrorMessage(null);
      setBalance(balance + amount);
      setAmount(0);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error adding funds:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setSuccessMessage(null);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome, {username}</h2>
      <p className={styles.balance}>
        Current Balance: £
        {balance.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>

      <div className={styles.fundContainer}>
        <input
          type="number"
          value={amount === 0 ? "" : amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className={styles.input}
          placeholder="Enter amount"
          step="0.01"
        />

        <button onClick={handleAddFunds} className={styles.button}>
          Add Funds
        </button>
      </div>

      <Snackbar
        open={openSnackbar}
        message={successMessage || errorMessage || "Something went wrong"}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default Profile;
