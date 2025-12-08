// src/api/client.js
import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080", // le port où tourne ton backend
    headers: {
        "Content-Type": "application/json",
    },
});

export default client;
