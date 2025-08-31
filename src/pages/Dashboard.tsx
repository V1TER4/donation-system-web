import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/auth";
import Sidebar from "./components/Sidebar";
import Loading from "./components/Loading";
import { useUser } from "../context/UserContext";

function Dashboard() {
    const { checkAuth } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        checkAuth();
    }, []);

    if (!user) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="d-flex vh-100 vw-100" style={{ minHeight: "100vh" }}>
            <Sidebar />
            <div className="content flex-grow-1 p-4">
                <h2>Dashboard</h2>
                <p>Bem-vindo ao painel principal!</p>
                <div className="row justify-content-center mt-4">
                    <div className="col-md-4">
                        <div className="card shadow-lg p-4 mx-auto">
                            <div className="card-body">
                                <h5 className="card-title">Doar</h5>
                                <p className="card-text">Faça uma doação para uma instituição financeira.</p>
                                <Link to="/donate" className="btn btn-primary">Realizar doação</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg p-4 mx-auto">
                            <div className="card-body">
                                <h5 className="card-title">Histórico</h5>
                                <p className="card-text">Veja o histórico de suas doações realizadas.</p>
                                <Link to="/history" className="btn btn-primary">Visualizar histórico</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-lg p-4 mx-auto">
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
