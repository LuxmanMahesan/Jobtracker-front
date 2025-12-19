// Optionnel : encore utile si tu veux tester en front, mais on ne l'utilise plus pour l'instant
export function calculerDateRelance(dateEnvoi, joursAvantRelance) {
    if (!dateEnvoi || joursAvantRelance === null || joursAvantRelance === undefined) {
        return null;
    }

    const d = new Date(dateEnvoi);
    if (isNaN(d.getTime())) return null;

    const resultat = new Date(d);
    resultat.setDate(resultat.getDate() + Number(joursAvantRelance));

    const annee = resultat.getFullYear();
    const mois = String(resultat.getMonth() + 1).padStart(2, "0");
    const jour = String(resultat.getDate()).padStart(2, "0");

    return `${annee}-${mois}-${jour}`;
}

export function joursRestants(dateRelance) {
    if (!dateRelance) return null;

    const cible = new Date(dateRelance);
    if (isNaN(cible.getTime())) return null;

    const maintenant = new Date();

    const aujourdHui = new Date(
        maintenant.getFullYear(),
        maintenant.getMonth(),
        maintenant.getDate()
    );
    const cibleJour = new Date(
        cible.getFullYear(),
        cible.getMonth(),
        cible.getDate()
    );

    const diffMs = cibleJour - aujourdHui;
    const diffJours = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return diffJours;
}
