import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../components/kanban/KanbanBoard";
import ModalCandidature from "../components/kanban/ModalCandidature";
import {
    listerCandidatures,
    modifierCandidature,
    creerCandidature,
    supprimerCandidature,
} from "../services/candidatureService";

export default function Dashboard() {
    const [candidatures, setCandidatures] = useState([]);
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(true);

    const [modalOuvert, setModalOuvert] = useState(false);
    const [modeModal, setModeModal] = useState("creation"); // "creation" | "edition"
    const [candidatureSelectionnee, setCandidatureSelectionnee] = useState(null);

    const navigate = useNavigate();

    const charger = async () => {
        setErreur("");
        setChargement(true);
        try {
            const data = await listerCandidatures();
            setCandidatures(data);
        } catch (e) {
            setErreur("Impossible de charger les candidatures (token/backend).");
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

    const ouvrirCreation = () => {
        setModeModal("creation");
        setCandidatureSelectionnee(null);
        setModalOuvert(true);
    };

    const ouvrirEdition = (candidature) => {
        setModeModal("edition");
        setCandidatureSelectionnee(candidature);
        setModalOuvert(true);
    };

    const fermerModal = () => {
        setModalOuvert(false);
        setCandidatureSelectionnee(null);
    };

    const surChangementStatut = async (id, nouveauStatut) => {
        const cible = candidatures.find((c) => c.id === id);
        if (!cible) return;

        const majLocale = { ...cible, statut: nouveauStatut };
        setCandidatures((ancien) => ancien.map((c) => (c.id === id ? majLocale : c)));

        try {
            await modifierCandidature(id, majLocale);
        } catch (e) {
            await charger();
        }
    };

    const surValiderModal = async (payload) => {
        if (modeModal === "creation") {
            const cree = await creerCandidature(payload);
            setCandidatures((ancien) => [cree, ...ancien]);
            return;
        }

        if (modeModal === "edition" && candidatureSelectionnee) {
            const id = candidatureSelectionnee.id;
            const maj = await modifierCandidature(id, payload);

            setCandidatures((ancien) => ancien.map((c) => (c.id === id ? maj : c)));
        }
    };

    const surSupprimer = async (candidature) => {
        const ok = window.confirm(
            `Supprimer la candidature "${candidature.titrePoste}" chez "${candidature.entreprise}" ?`
        );
        if (!ok) return;

        const id = candidature.id;

        // Optimiste
        setCandidatures((ancien) => ancien.filter((c) => c.id !== id));

        try {
            await supprimerCandidature(id);
        } catch (e) {
            await charger();
        }
    };

    return (
        <div style={{ padding: 12 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                }}
            >
                <h1 style={{ margin: 0 }}>Kanban des candidatures</h1>

                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={ouvrirCreation}>+ Nouvelle candidature</button>
                    <button onClick={charger}>Rafraîchir</button>
                    <button onClick={deconnecter}>Déconnexion</button>
                </div>
            </div>

            {chargement && <p>Chargement…</p>}
            {erreur && <p style={{ color: "crimson" }}>{erreur}</p>}

            {!chargement && !erreur && (
                <KanbanBoard
                    candidatures={candidatures}
                    surChangementStatut={surChangementStatut}
                    surEditer={ouvrirEdition}
                    surSupprimer={surSupprimer}
                />
            )}

            <ModalCandidature
                ouvert={modalOuvert}
                mode={modeModal}
                candidatureInitiale={candidatureSelectionnee}
                surFermer={fermerModal}
                surValider={surValiderModal}
            />
        </div>
    );
}
