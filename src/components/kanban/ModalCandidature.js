import { useEffect, useState } from "react";
import "./modal.css";

const FORM_VIDE = {
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
};

export default function ModalCandidature({
                                             ouvert,
                                             mode, // "creation" | "edition"
                                             candidatureInitiale, // objet candidature ou null
                                             surFermer,
                                             surValider, // (payload) => Promise
                                         }) {
    const [form, setForm] = useState(FORM_VIDE);
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        if (!ouvert) return;

        if (mode === "edition" && candidatureInitiale) {
            setForm({
                entreprise: candidatureInitiale.entreprise ?? "",
                titrePoste: candidatureInitiale.titrePoste ?? "",
                typeContrat: candidatureInitiale.typeContrat ?? "",
                lienAnnonce: candidatureInitiale.lienAnnonce ?? "",
                statut: candidatureInitiale.statut ?? "A_POSTULER",
                dateEnvoi: candidatureInitiale.dateEnvoi ?? "",
                dateLimite: candidatureInitiale.dateLimite ?? "",
                notes: candidatureInitiale.notes ?? "",
                joursAvantRelance:
                    candidatureInitiale.joursAvantRelance === null ||
                    candidatureInitiale.joursAvantRelance === undefined
                        ? ""
                        : String(candidatureInitiale.joursAvantRelance),
                relanceActive: !!candidatureInitiale.relanceActive,
            });
        } else {
            setForm(FORM_VIDE);
        }

        setErreur("");
    }, [ouvert, mode, candidatureInitiale]);

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

        const payload = {
            entreprise: form.entreprise.trim(),
            titrePoste: form.titrePoste.trim(),
            typeContrat: form.typeContrat?.trim() || "",
            lienAnnonce: form.lienAnnonce?.trim() || "",
            statut: form.statut || "A_POSTULER",
            dateEnvoi: form.dateEnvoi ? form.dateEnvoi : null,
            dateLimite: form.dateLimite ? form.dateLimite : null,
            notes: form.notes || "",
            joursAvantRelance: form.joursAvantRelance ? Number(form.joursAvantRelance) : null,
            relanceActive: !!form.relanceActive,
        };

        try {
            await surValider(payload);
            surFermer();
        } catch (e2) {
            setErreur("Action impossible (backend ? token ?).");
        }
    };

    const titre = mode === "edition" ? "Modifier la candidature" : "Nouvelle candidature";
    const texteBouton = mode === "edition" ? "Enregistrer" : "Créer";

    return (
        <div className="overlayModal" onMouseDown={surFermer}>
            <div className="contenuModal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="enteteModal">
                    <h2>{titre}</h2>
                    <button className="btnSecondaire" onClick={surFermer} type="button">
                        ✕
                    </button>
                </div>

                <form onSubmit={soumettre} className="formModal">
                    <label>Entreprise *</label>
                    <input name="entreprise" value={form.entreprise} onChange={changer} />

                    <label>Titre du poste *</label>
                    <input name="titrePoste" value={form.titrePoste} onChange={changer} />

                    <label>Type de contrat</label>
                    <input name="typeContrat" value={form.typeContrat} onChange={changer} />

                    <label>Lien de l’annonce</label>
                    <input name="lienAnnonce" value={form.lienAnnonce} onChange={changer} />

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
                            <input type="date" name="dateEnvoi" value={form.dateEnvoi} onChange={changer} />
                        </div>
                        <div>
                            <label>Date limite</label>
                            <input type="date" name="dateLimite" value={form.dateLimite} onChange={changer} />
                        </div>
                    </div>

                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={changer}
                        rows={4}
                        placeholder="Compte rendu, infos RH, etc."
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
                        <button className="btnSecondaire" type="button" onClick={surFermer}>
                            Annuler
                        </button>
                        <button className="btnPrimaire" type="submit">
                            {texteBouton}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
