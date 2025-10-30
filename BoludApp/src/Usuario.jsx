import React, { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./styles/Usuario.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Usuario({
                     isLoggedIn,
                     currentUser,
                     theme,
                     usersData,
                     publicaciones = [], // 👈 agregado: lista de publicaciones globales
                     handleEditProfile,
                 }) {
    const navigate = useNavigate();
    const { username: urlUsername } = useParams(); // Captura el nombre desde la URL
    const userToShow = urlUsername || currentUser;

    // Redirección si no hay sesión y no se está viendo otro perfil
    useEffect(() => {
        if (!urlUsername && !isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate, urlUsername]);

    if (!urlUsername && !isLoggedIn) return null;

    // Obtener datos del usuario desde usersData o localStorage
    let userData = usersData[userToShow];

    if (!userData) {
        const allAccounts = JSON.parse(localStorage.getItem("accounts")) || {};
        if (allAccounts[userToShow]) {
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

    // 🔹 Filtrar publicaciones del usuario
    const publicacionesUsuario = publicaciones.filter(
        (post) => post.usuario === userToShow
    );

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

                {publicacionesUsuario.length > 0 ? (
                    publicacionesUsuario.map((post) => (
                        <div key={post.id} className="usuario-post">
                            <h4>
                                <Link to={`/post/${post.id}`}>{post.titulo}</Link>
                            </h4>
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {post.contenido}
                            </Markdown>
                        </div>
                    ))
                ) : (
                    <p className="sin-posts">
                        {userToShow === currentUser
                            ? "Aún no has publicado nada."
                            : "Este usuario aún no tiene publicaciones."}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Usuario;
