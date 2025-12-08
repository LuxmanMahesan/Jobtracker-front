import { useState } from "react";
import client from "../../api/client";

export default function RegisterForm({ onSuccess }) {
    const [form, setForm] = useState({ nom: "", prenom: "", email: "", motDePasse: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await client.post("/auth/register", form);
            setMessage("Inscription réussie !");
            if (onSuccess) onSuccess();
        } catch (err) {
            setMessage(err.response?.data || "Erreur inscription");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
            <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="motDePasse" type="password" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} />
            <button type="submit">S'inscrire</button>
            {message && <p>{message}</p>}
        </form>
    );
}
