import client from "../api/client";

function versRequete(c) {
    return {
        entreprise: c.entreprise ?? "",
        titrePoste: c.titrePoste ?? "",
        typeContrat: c.typeContrat ?? "",
        lienAnnonce: c.lienAnnonce ?? "",
        statut: c.statut ?? "A_POSTULER",
        dateEnvoi: c.dateEnvoi || null,
        dateLimite: c.dateLimite || null,
        notes: c.notes ?? "",
        joursAvantRelance: c.joursAvantRelance ? Number(c.joursAvantRelance) : null,
        relanceActive: !!c.relanceActive,
        // ❌ On n'envoie PAS dateRelance : le backend la calcule
    };
}

export async function listerCandidatures() {
    const res = await client.get("/api/candidatures");
    return res.data;
}

export async function creerCandidature(candidature) {
    const res = await client.post("/api/candidatures", versRequete(candidature));
    return res.data;
}

export async function modifierCandidature(id, candidature) {
    const res = await client.put(`/api/candidatures/${id}`, versRequete(candidature));
    return res.data;
}

export async function supprimerCandidature(id) {
    await client.delete(`/api/candidatures/${id}`);
}
