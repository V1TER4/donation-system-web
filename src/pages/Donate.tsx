import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaHandHoldingHeart, FaHistory, FaStar, FaRegStar, FaSignOutAlt } from "react-icons/fa";

// Definição do tipo para Institution
type Institution = {
    id: number;
    name: string;
};

const DonationForm: React.FC = () => {
    const { checkAuth } = useAuth();
    useEffect(() => {
        checkAuth();
    }, []);

    const { user } = useUser();
    const [amount, setAmount] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]); // Tipo definido para institutions
    const [favoriteInstitution, setFavoriteInstitution] = useState<Institution | null>(null); // Tipagem correta
    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [useFavorite, setUseFavorite] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDonationData = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/donation/index/${user.id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                setInstitutions(data.institutions);
                setFavoriteInstitution(data.data.financial_institution);
                if (data.data.institution_id) {
                    setSelectedInstitution(data.data.institution_id);
                }
            } catch (error) {
                console.error("Error fetching donation data:", error);
            }
        };

        if (user) {
            fetchDonationData();
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            alert("Usuário não está logado.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    user_id: user.id,
                    institution_id: selectedInstitution,
                    value: parseFloat(amount.replace(/[^\d.-]/g, "")),
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                window.location.reload();
            } else {
                if (responseData.message?.value?.length) {
                    alert(responseData.message.value[0]);
                } else {
                    alert(responseData.message ?? "Ocorreu um erro desconhecido.");
                }
            }
        } catch (error) {
            console.error("Erro ao realizar doação:", error);
            alert("Ocorreu um erro. Tente novamente mais tarde.");
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="sidebar bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
                <h4 className="mb-4">{user?.name ?? "Usuário"}</h4>
                <button className="btn btn-outline-light d-flex align-items-center justify-content-start mb-2" onClick={() => navigate("/dashboard")}>
                    <FaTachometerAlt className="me-2" /> Dashboard
                </button>
                <button className="btn btn-outline-light d-flex align-items-center justify-content-start mb-2" onClick={() => navigate("/donate")}>
                    <FaHandHoldingHeart className="me-2" /> Doação
                </button>
                <button className="btn btn-outline-light d-flex align-items-center justify-content-start mb-2" onClick={() => navigate("/history")}>
                    <FaHistory className="me-2" /> Histórico
                </button>
                <button className="btn btn-outline-light d-flex align-items-center justify-content-start" onClick={() => navigate("/favorites")}>
                    <FaStar className="me-2" /> Favoritos
                </button>
                <button className="btn btn-outline-light d-flex align-items-center justify-content-start mt-auto" onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }}>
                    <FaSignOutAlt className="me-2" /> Deslogar
                </button>
            </div>

            <div className="content flex-grow-1 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary">Faça uma doação</h2>
                    <button className="btn btn-light border" onClick={() => navigate(-1)}>← Voltar</button>
                </div>
                <p className="text-muted">Faça uma doação para uma instituição de sua escolha.</p>
                <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "500px" }}>
                    <div className="mb-3">
                        <label className="form-label">Usuário</label>
                        <input type="text" className="form-control" value={user?.name || ""} readOnly disabled />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Instituição</label>
                        {favoriteInstitution && useFavorite ? (
                            <div className="d-flex align-items-center">
                                <input type="hidden" name="institution_id" value={favoriteInstitution.id} />
                                <input type="text" className="form-control me-2" value={favoriteInstitution.name} readOnly disabled />
                                <button type="button" className="btn btn-outline-warning" onClick={() => setUseFavorite(false)}>
                                    <FaStar />
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <select className="form-control me-2" value={selectedInstitution} onChange={(e) => setSelectedInstitution(e.target.value)} required>
                                    <option value="">Selecione uma instituição</option>
                                    {institutions.map((institution) => (
                                        <option key={institution.id} value={institution.id}>{institution.name}</option>
                                    ))}
                                </select>
                                {favoriteInstitution && (
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setUseFavorite(true)}>
                                        <FaRegStar />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Valor</label>
                        <select className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required>
                            <option value="">Selecione um valor</option>
                            <option value="5.00">R$ 5,00</option>
                            <option value="10.00">R$ 10,00</option>
                            <option value="20.00">R$ 20,00</option>
                            <option value="50.00">R$ 50,00</option>
                            <option value="100.00">R$ 100,00</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <button type="submit" className="btn btn-primary">Doar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonationForm;
