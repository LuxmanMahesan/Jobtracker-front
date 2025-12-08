import { useState } from "react";
import client from "../../api/client";

export default function LoginForm({ onSuccess }) {
    const [form, setForm] = useState({ email: "", motDePasse: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            if (onSuccess) onSuccess();
        } catch (err) {
            setMessage(err.response?.data || "Erreur login");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Connexion</h2>
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            <input name="motDePasse" type="password" placeholder="Mot de passe" value={form.motDePasse} onChange={handleChange} />
            <button type="submit">Se connecter</button>
            {message && <p>{message}</p>}
        </form>
    );
}
