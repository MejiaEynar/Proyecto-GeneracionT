import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Usuario.css";

function Usuario({ isLoggedIn, currentUser, theme }) {
    const navigate = useNavigate();

    // Redirección si no hay sesión
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    // Datos ficticios del usuario (puedes reemplazarlos por datos reales)
    const userData = {
        name: currentUser,
        username: `@${currentUser.toLowerCase()}`,
        bio: "Amante del código, la creatividad y las buenas ideas 💻✨",
        joined: "Junio 2023",
        following: 154,
        followers: 980,
        banner:
            "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
        avatar:
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
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
                    <button className="edit-profile">Editar perfil</button>
                </div>

                <h2>{userData.name}</h2>
                <p className="usuario-username">{userData.username}</p>
                <p className="usuario-bio">{userData.bio}</p>

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
