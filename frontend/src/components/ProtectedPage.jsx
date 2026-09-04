import { useAuth } from "./UserProvider";
import { Navigate } from "react-router-dom"
import { BasicBSSpinner } from "../pages/Base"

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