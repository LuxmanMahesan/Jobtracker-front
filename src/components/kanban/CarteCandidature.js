export default function CarteCandidature({ candidature }) {
    return (
        <div className="carteCandidature">
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
