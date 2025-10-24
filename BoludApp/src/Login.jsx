// Archivo: Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/LdNR.png";
import "./styles/Login.css";

function Login({ theme, handleLogin }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    // Guardar cuenta en localStorage
    const saveAccount = (user, pass) => {
        const accounts = JSON.parse(localStorage.getItem("accounts")) || {};
        accounts[user] = pass;
        localStorage.setItem("accounts", JSON.stringify(accounts));
    };

    // Verificar si la cuenta existe
    const checkAccount = (user, pass) => {
        const accounts = JSON.parse(localStorage.getItem("accounts")) || {};
        return accounts[user] === pass;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (isRegister) {
            // Crear nueva cuenta
            const accounts = JSON.parse(localStorage.getItem("accounts")) || {};
            if (accounts[username]) {
                alert("Ese usuario ya existe. Intenta iniciar sesión.");
                return;
            }
            saveAccount(username, password);
            alert("Cuenta creada con éxito 🎉");
            handleLogin(username);
            navigate("/");
        } else {
            // Iniciar sesión
            if (checkAccount(username, password)) {
                handleLogin(username);
                navigate("/");
            } else {
                alert("Usuario o contraseña incorrectos ❌");
            }
        }
    };

    return (
        <div className={`login-container ${theme}`}>
            <div className="login-box">
                <img src={Logo} alt="Logo" className="login-logo" />
                <h1 className="login-title">Lo que está pasando ahora</h1>
                <h2 className="login-subtitle">Únete hoy</h2>

                <div className="login-buttons">
                    <button onClick={() => setIsRegister(true)} className="btn-crear">
                        Crear cuenta
                    </button>

                    <p className="login-divider">¿Ya tienes una cuenta?</p>

                    <button onClick={() => setIsRegister(false)} className="btn-iniciar">
                        Iniciar sesión
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-enviar">
                        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
                    </button>
                </form>
            </div>
            <div className="login-footer">
                            <nav>
                                <a href="#">Información</a>
                                <a href="#">Centro de Ayuda</a>
                                <a href="#">Condiciones de Servicio</a>
                                <a href="#">Política de Privacidad</a>
                                <a href="#">Política de cookies</a>
                                <a href="#">Accesibilidad</a>
                                <a href="#">Información de anuncios</a>
                                <a href="#">Blog</a>
                                <a href="#">Empleos</a>
                                <a href="#">Recursos para marcas</a>
                                <a href="#">Publicidad</a>
                                <a href="#">Marketing</a>
                                <a href="#">Desarrolladores</a>
                                <a href="#">Guía</a>
                                <a href="#">Configuración</a>
                                <span>© 2025 BoludApp.</span>
                            </nav>
                        </div>
        </div>

    );
}

export default Login;
