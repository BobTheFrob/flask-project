import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function UserProvider({children}) {
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/user");
            const data = await response.json();

            if (response.ok) {
                setUser(data);
            } else {
                setUser(null);
            }

            setUserLoading(false);
        }

        fetchData();
    }, []);

    return (
    <AuthContext value={{user, setUser, userLoading}}>
        {children}
    </AuthContext>
    )
};

export function useAuth () {
    return useContext(AuthContext)
}