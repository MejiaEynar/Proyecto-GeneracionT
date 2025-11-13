import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/LdNR.png";
import "./styles/Login.css";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Login({ theme, handleLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const userRef = doc(db, "usuarios", username);
        const userSnap = await getDoc(userRef);

        if (isRegister) {
            // 🟢 Registrar nuevo usuario
            if (userSnap.exists()) {
                alert("Ese usuario ya existe. Intenta iniciar sesión.");
                return;
            }

            const nuevoUsuario = {
                username,
                password,
                name: username,
                bio: "",
                joined: new Date().toLocaleDateString(),
                followers: [],
                following: [],
                banner: "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
                avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
            };

            await setDoc(userRef, nuevoUsuario);
            alert("Cuenta creada con éxito 🎉");
            handleLogin(username);
            navigate("/");
        } else {
            // 🔵 Iniciar sesión
            if (!userSnap.exists()) {
                alert("Usuario no encontrado ❌");
                return;
            }

            const userData = userSnap.data();
            if (userData.password !== password) {
                alert("Contraseña incorrecta ❌");
                return;
            }

            handleLogin(username);
            navigate("/");
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
                    <p className="terms-text">
                        Al registrarte, aceptas los <a href="#">Términos de servicio</a> y la <a href="#">Política de privacidad</a>.
                    </p>
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
                    <a href="#">Publicidad</a>
                    <span>© 2025 BoludApp.</span>
                </nav>
            </div>
        </div>
    );
}

export default Login;
