import { joursRestants } from "../../utils/dateUtils";

function normaliserUrl(url) {
    if (!url) return null;
    const u = url.trim();
    if (!u) return null;

    if (u.startsWith("www.")) return `https://${u}`;
    if (!u.startsWith("http://") && !u.startsWith("https://")) return `https://${u}`;

    return u;
}

function rendreLienAffichage(url) {
    try {
        const u = new URL(url);
        return `${u.hostname}${u.pathname !== "/" ? u.pathname : ""}`;
    } catch {
        return url;
    }
}

export default function CarteCandidature({
                                             candidature,
                                             surEditer,
                                             surSupprimer,
                                             poigneeProps,
                                         }) {
    const clicEditer = (e) => {
        e.preventDefault();
        e.stopPropagation();
        surEditer(candidature);
    };

    const clicSupprimer = (e) => {
        e.preventDefault();
        e.stopPropagation();
        surSupprimer(candidature);
    };

    const urlAnnonce = normaliserUrl(candidature.lienAnnonce);

    const ouvrirAnnonce = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!urlAnnonce) return;
        window.open(urlAnnonce, "_blank", "noopener,noreferrer");
    };

    const dateRelance = candidature.dateRelance;
    const reste = joursRestants(dateRelance);

    let texteRelance = "";
    let classRelance = "";

    if (reste !== null) {
        if (reste > 7) {
            texteRelance = `Relance dans ${reste} jours`;
            classRelance = "relanceOk";
        } else if (reste > 0) {
            texteRelance = `Relance dans ${reste} jours`;
            classRelance = "relanceMoyen";
        } else if (reste === 0) {
            texteRelance = "Relance aujourd’hui";
            classRelance = "relanceUrgent";
        } else {
            texteRelance = `Retard de ${Math.abs(reste)} jours ⚠️`;
            classRelance = "relanceUrgent";
        }
    }

    console.log(
        `%c📌 CANDIDATURE ${candidature.id}`,
        "color:#007bff;font-weight:bold;",
        { dateRelance, reste }
    );

    return (
        <div className="carteCandidature">
            <div className="ligneHautCarte">
        <span className="poigneeDrag" title="Déplacer" {...poigneeProps}>
          ⋮⋮
        </span>

                <div className="actionsCarte">
                    <button className="btnCarte" type="button" onClick={clicEditer} title="Modifier">
                        ✎
                    </button>
                    <button className="btnCarte danger" type="button" onClick={clicSupprimer} title="Supprimer">
                        🗑
                    </button>
                </div>
            </div>

            <div className="carteTitre">{candidature.titrePoste}</div>
            <div className="carteSousTitre">{candidature.entreprise}</div>

            {candidature.typeContrat && (
                <div className="carteMini">Contrat : {candidature.typeContrat}</div>
            )}

            {candidature.dateEnvoi && (
                <div className="carteMini">Envoi : {candidature.dateEnvoi}</div>
            )}

            {urlAnnonce && (
                <div className="ligneLien">
                    <span className="badgeLien">🔗</span>
                    <a
                        className="lienAnnonce"
                        href={urlAnnonce}
                        target="_blank"
                        rel="noreferrer"
                        title={urlAnnonce}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={ouvrirAnnonce}
                    >
                        {rendreLienAffichage(urlAnnonce)}
                    </a>
                </div>
            )}

            {texteRelance && (
                <div className={`ligneRelance ${classRelance}`}>
                    {texteRelance}
                </div>
            )}
        </div>
    );
}
