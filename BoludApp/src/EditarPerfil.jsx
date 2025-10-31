import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/EditarPerfil.css";

function EditarPerfil({ theme, currentUser, usersData, handleEditProfile, isLoggedIn }) {
    const navigate = useNavigate();

    // Redirigir si no está logueado
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    // Obtener datos actuales del usuario
    const userData = usersData[currentUser] || {};

    // Estados locales del formulario
    const [name, setName] = useState(userData.name || currentUser);
    const [bio, setBio] = useState(userData.bio || "");
    const [bannerUrl, setBannerUrl] = useState(userData.banner || "");
    const [avatarUrl, setAvatarUrl] = useState(userData.avatar || "");
    const [error, setError] = useState("");

    // Manejo de archivos locales (banner y avatar)
    const handleBannerFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file); // crea URL temporal
            setBannerUrl(imageURL);
        }
    };

    const handleAvatarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setAvatarUrl(imageURL);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("El nombre no puede estar vacío.");
            return;
        }

        // Llamar a la función global para actualizar el perfil
        handleEditProfile(currentUser, {
            name,
            bio,
            banner: bannerUrl,
            avatar: avatarUrl,
        });

        alert("Perfil actualizado con éxito.");
        navigate("/usuario");
    };

    return (
        <div className={`usuario-container ${theme}`}>
            <div className="login-box" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h1>Editar Perfil</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre completo"
                    />

                    <label>Biografía:</label>
                    <textarea
                        className="editarBio"
                        id="content"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Escribe tu biografía aquí (máx. 160 caracteres)"
                        maxLength="160"
                        rows="3"
                    ></textarea>

                    {/* --- Banner --- */}
                    <label>Banner:</label>

                    <input type="file" accept="image/*" onChange={handleBannerFileChange} />
                    {bannerUrl && (
                        <img
                            src={bannerUrl}
                            alt="Vista previa del banner"
                            className="preview-banner"
                        />
                    )}

                    {/* --- Avatar --- */}
                    <label>Avatar:</label>
                    <input type="file" accept="image/*" onChange={handleAvatarFileChange} />
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt="Vista previa del avatar"
                            className="preview-avatar"
                        />
                    )}

                    <button type="submit" className="btn-crear" style={{ marginTop: '20px' }}>
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/usuario')}
                        className="btn-iniciar"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditarPerfil;
