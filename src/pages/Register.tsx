import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            alert("As senhas não coincidem.");
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
            });

            if (response.ok) {
                alert("Cadastro realizado com sucesso!");
                navigate("/login");
            } else {
                alert("Erro no cadastro. Verifique os dados e tente novamente.");
            }
        } catch (error) {
            console.error("Erro durante o cadastro:", error);
            alert("Ocorreu um erro. Tente novamente mais tarde.");
        }
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
            <div className="container d-flex justify-content-center">
                <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "10px" }}>
                    <h2 className="text-center mb-4">Cadastro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirme sua Senha</label>
                            <input
                                type="password"
                                className="form-control"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
                    </form>
                    <div className="text-center mt-3">
                        <p>Já tem uma conta? <a href="#" onClick={() => navigate("/login")} className="text-primary">Faça login</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
