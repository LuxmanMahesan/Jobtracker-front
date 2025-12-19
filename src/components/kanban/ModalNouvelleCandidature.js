import { useState } from "react";
import "./modal.css";

export default function ModalNouvelleCandidature({ ouvert, surFermer, surCreer }) {
    const [form, setForm] = useState({
        entreprise: "",
        titrePoste: "",
        typeContrat: "",
        lienAnnonce: "",
        statut: "A_POSTULER",
        dateEnvoi: "",
        dateLimite: "",
        notes: "",
        joursAvantRelance: "",
        relanceActive: false,
    });

    const [erreur, setErreur] = useState("");

    if (!ouvert) return null;

    const changer = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((ancien) => ({
            ...ancien,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const soumettre = async (e) => {
        e.preventDefault();
        setErreur("");

        if (!form.entreprise.trim() || !form.titrePoste.trim()) {
            setErreur("Entreprise et titre du poste sont obligatoires.");
            return;
        }

        // Normalisation : dates vides => null, nombre vide => null
        const payload = {
            ...form,
            dateEnvoi: form.dateEnvoi ? form.dateEnvoi : null,
            dateLimite: form.dateLimite ? form.dateLimite : null,
            joursAvantRelance: form.joursAvantRelance
                ? Number(form.joursAvantRelance)
                : null,
            notes: form.notes || "",
        };

        try {
            await surCreer(payload);

            // reset + fermeture
            setForm({
                entreprise: "",
                titrePoste: "",
                typeContrat: "",
                lienAnnonce: "",
                statut: "A_POSTULER",
                dateEnvoi: "",
                dateLimite: "",
                notes: "",
                joursAvantRelance: "",
                relanceActive: false,
            });
            surFermer();
        } catch (e2) {
            setErreur("Création impossible (backend ? token ?).");
        }
    };

    return (
        <div className="overlayModal" onMouseDown={surFermer}>
            <div className="contenuModal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="enteteModal">
                    <h2>Nouvelle candidature</h2>
                    <button className="btnSecondaire" onClick={surFermer} type="button">
                        ✕
                    </button>
                </div>

                <form onSubmit={soumettre} className="formModal">
                    <label>Entreprise *</label>
                    <input
                        name="entreprise"
                        value={form.entreprise}
                        onChange={changer}
                        placeholder="Ex: Capgemini"
                    />

                    <label>Titre du poste *</label>
                    <input
                        name="titrePoste"
                        value={form.titrePoste}
                        onChange={changer}
                        placeholder="Ex: Développeur Java"
                    />

                    <label>Type de contrat</label>
                    <input
                        name="typeContrat"
                        value={form.typeContrat}
                        onChange={changer}
                        placeholder="Ex: CDI"
                    />

                    <label>Lien de l’annonce</label>
                    <input
                        name="lienAnnonce"
                        value={form.lienAnnonce}
                        onChange={changer}
                        placeholder="https://..."
                    />

                    <label>Statut</label>
                    <select name="statut" value={form.statut} onChange={changer}>
                        <option value="A_POSTULER">À postuler</option>
                        <option value="CANDIDATURE_ENVOYEE">Envoyée</option>
                        <option value="EN_ATTENTE_REPONSE">En attente</option>
                        <option value="ENTRETIEN_PLANIFIE">Entretien</option>
                        <option value="REFUS">Refus</option>
                        <option value="OFFRE_RECUE">Offre</option>
                    </select>

                    <div className="ligneDeuxColonnes">
                        <div>
                            <label>Date d’envoi</label>
                            <input
                                type="date"
                                name="dateEnvoi"
                                value={form.dateEnvoi}
                                onChange={changer}
                            />
                        </div>
                        <div>
                            <label>Date limite</label>
                            <input
                                type="date"
                                name="dateLimite"
                                value={form.dateLimite}
                                onChange={changer}
                            />
                        </div>
                    </div>

                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={changer}
                        placeholder="Compte rendu, infos RH, etc."
                        rows={4}
                    />

                    <div className="ligneDeuxColonnes">
                        <div>
                            <label>Relance (jours)</label>
                            <input
                                name="joursAvantRelance"
                                value={form.joursAvantRelance}
                                onChange={changer}
                                placeholder="Ex: 7"
                                inputMode="numeric"
                            />
                        </div>

                        <div className="case">
                            <label className="labelCase">
                                <input
                                    type="checkbox"
                                    name="relanceActive"
                                    checked={form.relanceActive}
                                    onChange={changer}
                                />
                                Relance active
                            </label>
                        </div>
                    </div>

                    {erreur && <p className="erreurModal">{erreur}</p>}

                    <div className="piedModal">
                        <button className="btnPrimaire" type="button" onClick={surFermer}>
                            Annuler
                        </button>
                        <button className="btnPrimaire" type="submit">
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
