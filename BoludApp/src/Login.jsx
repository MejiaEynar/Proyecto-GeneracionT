// Archivo: Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/Admin.css"; // Se puede mantener para estilos básicos o eliminar
import "./styles/Login.css"; // <-- IMPORTAR EL NUEVO ARCHIVO CSS

function Login(props) {
    const { theme, handleLogin } = props;
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); // Simulado

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username.trim()) {
            handleLogin(username);
            navigate('/');
        } else {
            alert('Por favor, ingresa un nombre de usuario.');
        }
    };

    return (
        // Aplicamos la clase "theme" al contenedor principal para que herede los colores
        // y usamos la nueva clase 'login-container' y 'login-form'
        <div className={`login-container ${theme}`}>
            <div className='login-form'>
                <h1 >Inicia Sesión / Regístrate</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        value={username}
                        placeholder="Nombre de Usuario"
                        required
                    />
                    <input
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        value={password}
                        placeholder="Contraseña (simulada)"
                    />
                    <button type="submit">Entrar / Registrarse</button>
                </form>
            </div>
        </div>
    );
}

export default Login;