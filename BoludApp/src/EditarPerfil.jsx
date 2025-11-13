import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // 🔥 Asegúrate de tener este import correcto
import "./styles/EditarPerfil.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

function EditarPerfil({ theme, currentUser, usersData, handleEditProfile, isLoggedIn }) {
    const navigate = useNavigate();

    // 🔐 Redirigir si no está logueado
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;

    // 📦 Obtener datos actuales del usuario local
    const userData = usersData[currentUser] || {};

    // 🎛️ Estados locales del formulario
    const [name, setName] = useState(userData.name || currentUser);
    const [bio, setBio] = useState(userData.bio || "");
    const [bannerUrl, setBannerUrl] = useState(userData.banner || "");
    const [avatarUrl, setAvatarUrl] = useState(userData.avatar || "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🖼️ Manejo de archivos locales (banner y avatar)
    const handleBannerFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // 👁️ Mostrar vista previa local inmediata
            const localPreview = URL.createObjectURL(file);
            setBannerUrl(localPreview);

            try {
                const bannerRef = ref(storage, `banners/${currentUser}_${file.name}`);
                await uploadBytes(bannerRef, file);
                const downloadURL = await getDownloadURL(bannerRef);
                setBannerUrl(downloadURL);
            } catch (error) {
                console.error("❌ Error al subir banner:", error);
                setError("No se pudo subir el banner.");
            }
        }
    };

    const handleAvatarFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // 👁️ Mostrar vista previa local inmediata
            const localPreview = URL.createObjectURL(file);
            setAvatarUrl(localPreview);

            try {
                const avatarRef = ref(storage, `avatars/${currentUser}_${file.name}`);
                await uploadBytes(avatarRef, file);
                const downloadURL = await getDownloadURL(avatarRef);
                setAvatarUrl(downloadURL);
            } catch (error) {
                console.error("❌ Error al subir avatar:", error);
                setError("No se pudo subir el avatar.");
            }
        }
    };

    // 🧠 Cargar los datos actuales desde Firestore (si existen)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "usuarios", username);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setName(data.name || currentUser);
                    setBio(data.bio || "");
                    setBannerUrl(data.banner || "");
                    setAvatarUrl(data.avatar || "");
                }
            } catch (error) {
                console.error("❌ Error al obtener usuario de Firestore:", error);
            }
        };

        fetchUserData();
    }, [currentUser]);

    // 💾 Guardar cambios en Firestore y local
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("El nombre no puede estar vacío.");
            return;
        }

        setLoading(true);

        try {
            const userRef = doc(db, "usuarios", currentUser);

            // 🔥 Si el documento no existe, lo crea
            await setDoc(userRef, {
                name,
                bio,
                banner: bannerUrl,
                avatar: avatarUrl,
            }, { merge: true });

            // ✅ Actualizar también en la app local
            handleEditProfile(currentUser, {
                name,
                bio,
                banner: bannerUrl,
                avatar: avatarUrl,
            });

            alert("Perfil actualizado con éxito ✅");
            navigate("/usuario");
        } catch (error) {
            console.error("❌ Error al guardar cambios:", error);
            setError("Ocurrió un error al guardar los cambios. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`usuario-container ${theme}`}>
            <div className="login-box" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h1>Editar Perfil</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading && <p style={{ color: 'gray' }}>Guardando cambios...</p>}

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

                    <button type="submit" className="btn-crear" style={{ marginTop: '20px' }} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
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
