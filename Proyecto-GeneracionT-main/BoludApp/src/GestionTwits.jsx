import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/GestionTwits.css";

function GestionTwits() {
    const [twits, setTwits] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("publicaciones")) || [];
        setTwits(data);
    }, []);

    const handleEliminar = (id) => {
        if (confirm("¿Seguro que querés eliminar este tuit?")) {
            const actualizados = twits.filter((t) => t.id !== id);
            setTwits(actualizados);
            localStorage.setItem("publicaciones", JSON.stringify(actualizados));
        }
    };

    const handleRevisar = (id) => {
        navigate(`/comentar/${id}`);
    };

    const twitsFiltrados = twits.filter((t) =>
        t.usuario.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="admin-container">
            <h2>Gestión de Twits</h2>
            <input
                type="text"
                placeholder="Buscar por usuario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="buscador-admin"
            />

            <table className="tabla-admin">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Contenido</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {twitsFiltrados.length > 0 ? (
                    twitsFiltrados.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.usuario}</td>
                            <td className="contenido-celda">{t.contenido}</td>
                            <td>
                                <button className="btn-revisar" onClick={() => handleRevisar(t.id)}>
                                    Revisar
                                </button>
                                <button className="btn-eliminar" onClick={() => handleEliminar(t.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">No hay twits disponibles.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default GestionTwits;
