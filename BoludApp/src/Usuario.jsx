import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./styles/Usuario.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import inicioBlack from "./assets/inicioBlack.png";
import inicioWhite from "./assets/inicioWhite.png";

const formatDate = (fecha) => {
  if (!fecha) return "Fecha desconocida";
  if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleDateString("es-ES");
  if (typeof fecha === "string" || typeof fecha === "number")
    return new Date(fecha).toLocaleDateString("es-ES");
  return "Fecha inválida";
};

function Usuario({
    isLoggedIn,
    currentUser,
    theme,
    publicaciones = [],
}) {
    const navigate = useNavigate();
    const { username: urlUsername } = useParams();
    const userToShow = urlUsername || currentUser;
    const [userData, setUserData] = useState(null);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userToShow) return;

            const userRef = doc(db, "usuarios", userToShow);
            const currentUserRef = currentUser ? doc(db, "usuarios", currentUser) : null;

            const [userSnap, currentUserSnap] = await Promise.all([
                getDoc(userRef),
                currentUserRef ? getDoc(currentUserRef) : [null]
            ]);

            if (userSnap.exists()) {
                setUserData(userSnap.data());
            } else {
                setUserData({
                    name: "Usuario no encontrado",
                    username: "@desconocido",
                    bio: "Este usuario no existe o fue eliminado.",
                    joined: "Desconocido",
                    following: [],
                    followers: [],
                    banner: "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
                    avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
                });
            }

            if (currentUserSnap?.exists()) {
                const data = currentUserSnap.data();
                setCurrentUserData(data);
                setIsFollowing(data.following?.includes(userToShow));
            }
        };

        fetchUserData();
    }, [userToShow, currentUser]);

    const handleFollowToggle = async () => {
        if (!isLoggedIn || !currentUser || !userData) return;

        const currentUserRef = doc(db, "usuarios", currentUser);
        const userToShowRef = doc(db, "usuarios", userToShow);

        try {
            if (isFollowing) {
                await Promise.all([
                    updateDoc(currentUserRef, { following: arrayRemove(userToShow) }),
                    updateDoc(userToShowRef, { followers: arrayRemove(currentUser) })
                ]);
                setIsFollowing(false);
            } else {
                await Promise.all([
                    updateDoc(currentUserRef, { following: arrayUnion(userToShow) }),
                    updateDoc(userToShowRef, { followers: arrayUnion(currentUser) })
                ]);
                setIsFollowing(true);
            }

            const updatedUserSnap = await getDoc(userToShowRef);
            if (updatedUserSnap.exists()) setUserData(updatedUserSnap.data());
        } catch (error) {
            console.error("Error al seguir/dejar de seguir:", error);
        }
    };

    useEffect(() => {
        if (!urlUsername && !isLoggedIn) navigate("/login");
    }, [isLoggedIn, navigate, urlUsername]);

    if (!userData) return <p>Cargando perfil...</p>;

    const isCurrentUserProfile = userToShow === currentUser;
    const buttonClass = isFollowing ? "unfollow" : "follow";
    const buttonText = isFollowing ? "Dejar de Seguir" : "Seguir";
    const followerCount = Array.isArray(userData.followers) ? userData.followers.length : 0;
    const followingCount = Array.isArray(userData.following) ? userData.following.length : 0;

    // 🔹 Filtrar y ordenar publicaciones del usuario por fecha (más reciente primero)
    const publicacionesUsuario = publicaciones
        .filter((post) => post.usuario === userToShow)
        .sort((a, b) => {
            const fechaA = a.fechaCreacion?.seconds ? a.fechaCreacion.seconds * 1000 : new Date(a.fechaCreacion).getTime();
            const fechaB = b.fechaCreacion?.seconds ? b.fechaCreacion.seconds * 1000 : new Date(b.fechaCreacion).getTime();
            return fechaB - fechaA;
        });

    return (
        <>
            <header className='Nav-comentar'>
                <ul>
                    <li>
                        <Link className="inicio" to="/">
                            {theme === 'light' ?
                                <img src={inicioBlack} className="Logo" alt="modo claro" /> :
                                <img src={inicioWhite} className="Logo" alt="modo oscuro" />}
                        </Link>
                    </li>
                </ul>
            </header>

            <div className={`usuario-container ${theme}`}>
                <div className="usuario-banner">
                    <img src={userData.banner} alt="banner" />
                </div>

                <div className="usuario-info">
                    <div className="usuario-avatar">
                        <img src={userData.avatar} alt="avatar" />
                    </div>

                    <div className="usuario-actions">
                        {isCurrentUserProfile ? (
                            <button className="edit-profile" onClick={() => navigate("/editar-perfil")}>
                                Editar perfil
                            </button>
                        ) : isLoggedIn && (
                            <button
                                className={`follow-toggle-button ${buttonClass}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollowToggle();
                                }}
                            >
                                {buttonText}
                            </button>
                        )}
                    </div>

                    <h2>{userData.name}</h2>
                    <p className="usuario-username">@{userToShow}</p>
                    <p className="usuario-bio">{userData.bio || "Sin biografía"}</p>
                    <p className="usuario-joined">📅 Se unió en {userData.joined || "Desconocido"}</p>

                    <div className="usuario-follow">
                        <span><strong>{followingCount}</strong> Siguiendo</span>
                        <span><strong>{followerCount}</strong> Seguidores</span>
                    </div>
                </div>

                <div className="usuario-posts">
                    <h3>Publicaciones</h3>
                    {publicacionesUsuario.length > 0 ? (
                        publicacionesUsuario.map((post) => (
                            <div key={post.id} className="usuario-post">
                                <div className='usuario-post-header'>
                                    <h4>
                                        <Link to={`/post/${post.id}`}>{post.titulo}</Link>
                                    </h4>
                                    {post.fechaCreacion && (
                                        <span className='usuario-post-date'>
                                          {formatDate(post.fechaCreacion)}
                                        </span>
                                    )}
                                </div>

                                <Markdown remarkPlugins={[remarkGfm]}>
                                    {post.contenido}
                                </Markdown>
                            </div>
                        ))
                    ) : (
                        <p className="sin-posts">
                            {isCurrentUserProfile
                                ? "Aún no has publicado nada."
                                : "Este usuario aún no tiene publicaciones."}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Usuario;
