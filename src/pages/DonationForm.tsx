import React, { useState } from "react";
import { useUser } from "../context/UserContext";

const DonationForm: React.FC = () => {
    const { user } = useUser();
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            alert("User not logged in");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    user_id: user.id,
                    institution_id: 1,
                    amount,
                }),
            });

            if (response.ok) {
                alert("Donation successful!");
            } else {
                alert("Donation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during donation:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Make a Donation</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        value={user?.name || ""}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Institution</label>
                    <input
                        type="text"
                        className="form-control"
                        value={"AQUI"}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Donate</button>
            </form>
        </div>
    );
};

export default DonationForm;