import RegisterForm from "../components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    return <RegisterForm onSuccess={() => navigate("/login")} />;
}
