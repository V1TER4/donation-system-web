import { useAuth } from "../utils/auth";
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

// Tipagem dos dados
type Institution = {
    id: number;
    name: string;
};

type Favorite = {
    institution_id: number;
    financial_institution: { name: string };
};

function Favorites() {
    const { checkAuth } = useAuth();
    const [favorite, setFavorite] = useState<Favorite | null>(null);
    const [selectedFavorite, setSelectedFavorite] = useState<string>('');
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            fetchFavorites();
            fetchInstitutions();
        }
    }, [user]);

    const fetchFavorites = async () => {
        if (!user) return; // Verifica se o user é null antes de continuar
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/favorite/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();

            if (data.data) {
                setFavorite(data.data);
                setSelectedFavorite(data.data.institution_id.toString());
            }
        } catch (error) {
            console.error("Erro ao carregar favoritos", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInstitutions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/institutions`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setInstitutions(data.data);
        } catch (error) {
            console.error("Erro ao carregar instituições", error);
        }
    };

    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedFavorite(selected);
    };

    const handleCreateFavorite = async () => {
        if (!selectedFavorite) {
            alert("Selecione uma instituição para adicionar aos favoritos");
            return;
        }

        try {
            if (!user) return; // Verifica se o user é null antes de continuar

            const response = await fetch(`${import.meta.env.VITE_API_URL}/favorite`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    institution_id: selectedFavorite
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar favorito");
            }

            alert("Favorito criado com sucesso!");
            fetchFavorites();
        } catch (error) {
            console.error("Erro ao criar favorito", error);
        }
    };

    const handleDeleteFavorite = async () => {
        if (!favorite) {
            alert("Nenhum favorito para deletar.");
            return;
        }

        try {
            if (!user) return; // Verifica se o user é null antes de continuar

            const response = await fetch(`${import.meta.env.VITE_API_URL}/favorite/${user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                alert("Favorito deletado com sucesso!");
                setFavorite(null);
                setSelectedFavorite('');
            } else {
                throw new Error("Erro ao deletar o favorito");
            }
        } catch (error) {
            console.error("Erro ao deletar favorito", error);
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
        <div className="d-flex">
            <Sidebar />
            <div className="content flex-grow-1 p-4">
                <h2>Favoritos</h2>
                <p>Selecione uma instituição favorita abaixo:</p>
                {favorite ? (
                    <div className="form-group">
                        <label htmlFor="favoriteSelect">Instituição favorita</label>
                        <div className="d-flex">
                            <select
                                id="favoriteSelect"
                                className="form-control"
                                value={favorite.institution_id}
                                onChange={handleSelectChange}
                            >
                                <option value={favorite.institution_id}>
                                    {favorite.financial_institution?.name || "Instituição desconhecida"}
                                </option>
                            </select>
                            <button
                                className="btn btn-danger ms-2"
                                onClick={handleDeleteFavorite}
                                style={{ height: '38px' }}
                            >
                                Deletar
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Nenhum favorito encontrado.</p>
                )}

                {!favorite && (
                    <div className="mt-4">
                        <p>Você ainda não tem um favorito. Selecione uma instituição para adicionar aos favoritos:</p>
                        <select
                            id="institutionSelect"
                            className="form-control"
                            value={selectedFavorite}
                            onChange={handleSelectChange}
                        >
                            <option value="">Selecione uma instituição</option>
                            {institutions.map((institution) => (
                                <option key={institution.id} value={institution.id}>
                                    {institution.name}
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-primary mt-3" onClick={handleCreateFavorite}>
                            Adicionar aos Favoritos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Favorites;
