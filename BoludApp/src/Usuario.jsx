import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Usuario.css";

function Usuario({ isLoggedIn, currentUser, theme, usersData, handleEditProfile }) {
    const navigate = useNavigate();

    // Redirección si no hay sesión
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    // Obtener los datos del usuario actual desde el estado global (App.jsx)
    const userData = usersData[currentUser] || {
        name: currentUser,
        username: `@${currentUser.toLowerCase()}`,
        bio: "Parece que no tienes biografía. ¡Edita tu perfil!",
        joined: "Fecha Desconocida", // Será actualizado por App.jsx
        following: 0,
        followers: 0,
        banner:
            "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
        avatar:
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
    };

    const handleEditClick = () => {
        navigate("/editar-perfil");
    };

    return (
        <div className={`usuario-container ${theme}`}>
            <div className="usuario-banner">
                <img src={userData.banner} alt="banner" />
            </div>

            <div className="usuario-info">
                <div className="usuario-avatar">
                    <img src={userData.avatar} alt="avatar" />
                </div>

                <div className="usuario-actions">
                    {/* Al hacer clic, navega a la ruta de edición */}
                    <button className="edit-profile" onClick={handleEditClick}>Editar perfil</button>
                </div>

                <h2>{userData.name}</h2>
                <p className="usuario-username">{userData.username}</p>
                {/* Muestra la bio, usando un texto por defecto si está vacía */}
                <p className="usuario-bio">{userData.bio || "Sin biografía"}</p>

                {/* Muestra la fecha de registro del usuario */}
                <p className="usuario-joined">📅 Se unió en {userData.joined}</p>

                <div className="usuario-follow">
          <span>
            <strong>{userData.following}</strong> Siguiendo
          </span>
                    <span>
            <strong>{userData.followers}</strong> Seguidores
          </span>
                </div>
            </div>

            <div className="usuario-posts">
                <h3>Publicaciones</h3>
                <p className="sin-posts">Aún no has publicado nada.</p>
            </div>
        </div>
    );
}

export default Usuario;