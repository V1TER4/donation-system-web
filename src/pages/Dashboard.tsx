import { useEffect } from "react";
import { useAuth } from "../utils/auth";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaHandHoldingHeart, FaHistory, FaStar, FaSignOutAlt } from "react-icons/fa";

function Dashboard() {
    const { checkAuth } = useAuth();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <div className="d-flex">
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
            <div className="content flex-grow-1 p-4">
                <h2>Dashboard</h2>
                <p>Bem-vindo ao painel principal!</p>
                <div className="row justify-content-center mt-4">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Doar</h5>
                                <p className="card-text">Faça uma doação para uma instituição financeira.</p>
                                <Link to="/donate" className="btn btn-primary">Realizar doação</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Histórico</h5>
                                <p className="card-text">Veja o histórico de suas doações.</p>
                                <Link to="/history" className="btn btn-primary">Visualizar histórico</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Favoritos</h5>
                                <p className="card-text">Veja  aqui a sua instituição favorita.</p>
                                <Link to="/favorites" className="btn btn-primary">Visualizar favorito</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
