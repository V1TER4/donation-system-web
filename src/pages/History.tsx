import { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaTachometerAlt, FaHandHoldingHeart, FaHistory, FaStar, FaSignOutAlt } from "react-icons/fa";

interface Donation {
    id: number;
    user: {
        name: string;
    };
    financial_institution: {
        name: string;
    };
    value: string;
    created_at: string;
}

function History() {
    const { checkAuth } = useAuth();
    const navigate = useNavigate();
    const { user } = useUser();
    const [donations, setDonations] = useState<Donation[]>([]);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchDonations = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/donation/${user.id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDonations(data.data);
                } else {
                    alert("Falha ao carregar o histórico de doações. Tente novamente.");
                }
            } catch (error) {
                console.error("Erro ao carregar o histórico de doações:", error);
                alert("Ocorreu um erro. Tente novamente mais tarde.");
            }
        };

        fetchDonations();
    }, [user]);

    if (!user) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="d-flex vh-100">
            <div className="sidebar bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px' }}>
                <h4 className="mb-4">{user.name}</h4>
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
                    <h2 className="text-primary">Histórico de Doações</h2>
                    <button className="btn btn-light border" onClick={() => navigate(-1)}>← Voltar</button>
                </div>

                <p className="text-muted">Aqui você pode visualizar todas as suas doações feitas.</p>

                <div className="table-responsive">
                    <table className="table table-hover w-100">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Usuário</th>
                                <th>Instituição</th>
                                <th>Quantia</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.length > 0 ? (
                                donations.map((donation) => (
                                    <tr key={donation.id}>
                                        <td>{donation.id}</td>
                                        <td>{donation.user.name}</td>
                                        <td>{donation.financial_institution.name}</td>
                                        <td>R$ {donation.value.replace('.', ',')}</td>
                                        <td>{new Date(donation.created_at).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-3">
                                        Nenhuma doação encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default History;
