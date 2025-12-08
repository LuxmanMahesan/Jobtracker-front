import LoginForm from "../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    return <LoginForm onSuccess={() => navigate("/dashboard")} />;
}
