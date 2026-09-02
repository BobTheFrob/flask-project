import { useAuth } from "../components/UserProvider";
import { Navigate } from "react-router-dom"
import { BasicBSSpinner } from "./Base"

export default function ProtectedPage({ children }) {
    const { user, userLoading } = useAuth()

    if (userLoading) {
        return <BasicBSSpinner />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}