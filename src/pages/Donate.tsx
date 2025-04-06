import { useAuth } from "../utils/auth";
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import DonationSuccess from "./components/DonationSuccess";
import DonationFail from "./components/DonationFail";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

type Institution = {
    id: number;
    name: string;
};

type DonationFailMessage = {
    message: string;
}

const DonationForm: React.FC = () => {
    const { checkAuth } = useAuth();
    useEffect(() => {
        checkAuth();
    }, []);

    const { user } = useUser();
    const [amount, setAmount] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [favoriteInstitution, setFavoriteInstitution] = useState<Institution | null>(null);
    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [useFavorite, setUseFavorite] = useState(true);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showDonationSuccess, setShowDonationSuccess] = useState(false);
    const [showDonationFail, setShowDonationFail] = useState(false);
    const [showDonationFailMessage, setDonationFailMessage] = useState<DonationFailMessage | null>(null);

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
            } finally {
                setLoading(false);
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
                setShowDonationSuccess(true);
            } else {
                if (responseData.message?.value?.length) {
                    setDonationFailMessage({message: responseData.message.value[0]});
                    setShowDonationFail(true);
                } else {
                    setDonationFailMessage({message: responseData.message});
                    setShowDonationFail(true);
                }
            }
        } catch (error) {
            setDonationFailMessage({ message: "Ocorreu um erro. Tente novamente mais tarde" });
            setShowDonationFail(true);
            console.error("Erro ao realizar doação:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="d-flex vh-100">
            <Sidebar />

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

            {showDonationSuccess && (
                <DonationSuccess onClose={() => {
                        setShowDonationSuccess(false);
                        window.location.reload();
                    }}
                    show={showDonationSuccess}
                />
            )}

            {showDonationFail && (
            <DonationFail
                    onClose={() => {
                        setShowDonationFail(false); 
                        window.location.reload();
                    }}
                    show={showDonationFail} title={"Falha ao tentar realizar uma doação"} message={showDonationFailMessage?.message || "Ocorreu um erro desconhecido."} />
            )}
        </div>
    );
};

export default DonationForm;
