import { useEffect } from "react";
import { useAuth } from "../../utils/auth";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaHandHoldingHeart, FaHistory, FaStar, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
    const { checkAuth } = useAuth();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        checkAuth();
    }, []);

    if (!user) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="sidebar bg-dark text-white p-3 d-flex flex-column" style={{ width: '250px', minHeight: '100vh' }}>
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
    )
}

export default Sidebar;