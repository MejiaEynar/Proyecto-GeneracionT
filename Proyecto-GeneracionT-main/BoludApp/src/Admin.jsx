import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./styles/Admin.css";

// ⚠️ IMPORTANTE: En un entorno de producción, la contraseña NO debe estar aquí.
// Debería ser una variable de entorno como `import.meta.env.VITE_ADMIN_PASSWORD`
const ADMIN_PASSWORD = '1234';

function Admin ({ setAdmin, theme }) {
    const navigate = useNavigate();
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        setError(false);

        const passIngresada = contraseña.trim();

        if (passIngresada === ADMIN_PASSWORD) {
            setAdmin(true);
            // Redirigir al nuevo Dashboard
            navigate('/dashboard-admin');
        } else {
            setContraseña('');
            setError(true);
        }
    };

    // Usar una constante para el estado del botón es más limpio
    const isButtonDisabled = contraseña.trim().length === 0;

    return (
        <div className={`admin-login-container ${theme}`}> {/* MODIFICADO */}
            <h1 className='admin-login-h1'>Ingrese la contraseña del administrador</h1> {/* MODIFICADO */}

            <div className='form-Admin-login'> {/* MODIFICADO */}
                <form onSubmit={handleSubmit} className='admin-login-form'> {/* MODIFICADO */}
                    <input
                        onChange={e => setContraseña(e.target.value)}
                        type="password"
                        value={contraseña}
                        placeholder="Ingresa la contraseña"
                        className={error ? 'input-error' : ''}
                        maxLength={30}
                    />

                    <button type="submit" disabled={isButtonDisabled}>
                        Entrar
                    </button>

                    {error && (
                        // ❌ ERROR ESTABA AQUÍ: El comentario de barra /* ... */ no debe ir al final de una línea JSX
                        <p className='error-login-message'>Contraseña incorrecta. Inténtalo de nuevo.</p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Admin;