import { useEffect, useState } from "react";
import { useAuth } from "../utils/auth";
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

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
    const [loading, setLoading] = useState(true);

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
            finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, [user]);
    
    if (loading || !user) {
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
