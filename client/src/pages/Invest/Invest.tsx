import { Snackbar } from "@mui/material";
import { useState } from "react";
import styles from "./Invest.module.css";

const Invest = () => {
  const [selectedFund, setSelectedFund] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const funds = [
    { id: "1", name: "Cushon Equities Fund" },
    { id: "2", name: "Cushon Ethical Fund" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFund || !amount) {
      setErrorMessage("Please select a fund and enter an amount.");
      setSuccessMessage(null);
      setOpenSnackbar(true);
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      setSuccessMessage(null);
      setOpenSnackbar(true);
      return;
    }

    if (parsedAmount > 50000) {
      setErrorMessage("Maximum investment limit is £50,000.");
      setSuccessMessage(null);
      setOpenSnackbar(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You must be logged in to invest.");
      setSuccessMessage(null);
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fund: selectedFund,
          amount: parsedAmount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          `Successfully invested £${parsedAmount.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
          })} into ${selectedFund}`
        );
        setErrorMessage(null);
        setAmount("");
        setSelectedFund("");
        setOpenSnackbar(true);
      } else {
        setErrorMessage(data.error || "Investment failed.");
        setSuccessMessage(null);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setSuccessMessage(null);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className={styles.investContainer}>
      <h1 className={styles.title}>Invest in a Fund</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Select a Fund:</label>
        <select
          value={selectedFund}
          onChange={(e) => setSelectedFund(e.target.value)}
          className={styles.select}
        >
          <option value="">-- Choose a Fund --</option>
          {funds.map((fund) => (
            <option key={fund.id} value={fund.name}>
              {fund.name}
            </option>
          ))}
        </select>

        <label className={styles.label}>Enter Amount (£):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
          min="1"
          step="0.01"
        />

        <button type="submit" className={styles.button}>
          Invest
        </button>
      </form>

      <Snackbar
        open={openSnackbar}
        message={successMessage || errorMessage || "Something went wrong"}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default Invest;
