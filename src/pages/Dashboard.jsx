import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../components/kanban/KanbanBoard";
import { listerCandidatures, modifierCandidature } from "../services/candidatureService";

export default function Dashboard() {
    const [candidatures, setCandidatures] = useState([]);
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(true);

    const navigate = useNavigate();

    const charger = async () => {
        setErreur("");
        setChargement(true);
        try {
            const data = await listerCandidatures();
            setCandidatures(data);
        } catch (e) {
            setErreur("Impossible de charger les candidatures (token manquant/expiré ? backend ?).");
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        charger();
    }, []);

    const deconnecter = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const surChangementStatut = async (id, nouveauStatut) => {
        const cible = candidatures.find((c) => c.id === id);
        if (!cible) return;

        // Optimiste : on met à jour l'UI tout de suite
        const majLocale = { ...cible, statut: nouveauStatut };
        setCandidatures((ancien) => ancien.map((c) => (c.id === id ? majLocale : c)));

        try {
            await modifierCandidature(id, majLocale);
        } catch (e) {
            // rollback simple : on recharge depuis le serveur
            await charger();
        }
    };

    return (
        <div style={{ padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Kanban des candidatures</h1>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={charger}>Rafraîchir</button>
                    <button onClick={deconnecter}>Déconnexion</button>
                </div>
            </div>

            {chargement && <p>Chargement…</p>}
            {erreur && <p style={{ color: "crimson" }}>{erreur}</p>}

            {!chargement && !erreur && (
                <KanbanBoard candidatures={candidatures} surChangementStatut={surChangementStatut} />
            )}
        </div>
    );
}
