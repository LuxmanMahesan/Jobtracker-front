export default function CarteCandidature({
                                             candidature,
                                             surEditer,
                                             surSupprimer,
                                             poigneeProps, // props dragHandle
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
        </div>
    );
}
