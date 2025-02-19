import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Invest.module.css";

const Invest = () => {
  const [selectedFund, setSelectedFund] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const funds = [
    { id: "1", name: "Cushon Growth Fund" },
    { id: "2", name: "Cushon Ethical Fund" },
    { id: "3", name: "Cushon Tech Fund" },
    { id: "4", name: "Cushon Retirement Fund" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFund || !amount) {
      alert("Please select a fund and enter an amount.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to invest.");
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
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully invested £${amount} into ${selectedFund}`);
        setAmount("");
        setSelectedFund("");
        navigate("/portfolio");
      } else {
        alert(data.error || "Investment failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
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
    </div>
  );
};

export default Invest;
