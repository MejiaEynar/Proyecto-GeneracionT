import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/Usuario.css";

function Usuario({ isLoggedIn, currentUser, theme, usersData, handleEditProfile }) {
    const navigate = useNavigate();
    const { username: urlUsername } = useParams(); // 👈 Captura el nombre desde la URL (para admin)
    const userToShow = urlUsername || currentUser; // 👈 Si hay username en la URL, lo usa; sino, el del usuario actual

    // Redirección si no hay sesión
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    // ✅ Obtener datos del usuario desde usersData o accounts
    let userData = usersData[userToShow];

    if (!userData) {
        const allAccounts = JSON.parse(localStorage.getItem("accounts")) || {};
        if (allAccounts[userToShow]) {
            // Crear datos por defecto si el usuario existe pero no tiene datos cargados
            userData = {
                name: userToShow,
                username: `@${userToShow.toLowerCase()}`,
                bio: "",
                joined: "Fecha Desconocida",
                following: 0,
                followers: 0,
                banner:
                    "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
                avatar:
                    "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            };
        } else {
            // Si el usuario no existe en absoluto
            userData = {
                name: "Usuario no encontrado",
                username: "@desconocido",
                bio: "Este usuario no existe o fue eliminado.",
                joined: "Desconocido",
                following: 0,
                followers: 0,
                banner:
                    "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
                avatar:
                    "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            };
        }
    }

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
                    {/* Botón de editar perfil solo si es el usuario actual */}
                    {userToShow === currentUser && (
                        <button className="edit-profile" onClick={handleEditClick}>
                            Editar perfil
                        </button>
                    )}
                </div>

                <h2>{userData.name}</h2>
                <p className="usuario-username">{userData.username}</p>
                <p className="usuario-bio">{userData.bio || "Sin biografía"}</p>
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
