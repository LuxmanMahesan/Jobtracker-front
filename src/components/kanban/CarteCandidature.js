function normaliserUrl(url) {
    if (!url) return null;
    const u = url.trim();
    if (!u) return null;

    // si l’utilisateur met "www.site.com" sans protocole
    if (u.startsWith("www.")) return `https://${u}`;

    // si l’utilisateur met "site.com" sans protocole (optionnel)
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
        // ✅ Important : empêche le clic de remonter sur la carte
        e.preventDefault();
        e.stopPropagation();

        if (!urlAnnonce) return;

        // ✅ Robuste même si un parent fait preventDefault()
        window.open(urlAnnonce, "_blank", "noopener,noreferrer");
    };

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

            {/* ✅ Lien annonce */}
            {urlAnnonce && (
                <div className="ligneLien">
                    <span className="badgeLien">🔗</span>

                    {/* onMouseDown stopPropagation évite aussi un “début de drag” selon certains cas */}
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
        </div>
    );
}
