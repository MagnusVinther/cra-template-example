// Denne komponent skal bruges til at kunne fører data ned igennem komponenternes hieraki via AuthProvideren, der placeres så højt som muligt således at den gælder i alle child-komponenter.
// login-data bliver håndteret af et custom hook som navngives useAuth, således at der er styr på hvorvidt man er logget ind på alle pages.


// React, Hooks.

import { createContext, useContext, useEffect, useState } from 'react';

// Variable til at lave kontekst.
const AuthContext = createContext();

// Variable til at definerer contextProvider, med children som den værdi.
const AuthProvider = ({children}) => {
    // useState hook til at kontrolerer og ændre tilstandsværdier
    const [loginData, setLoginData ] = useState('') //streng-værdi

    // Setter ny data i logindata og opdaterer logindata hvis token findes i sessionstorage.
    useEffect(() => {
        // If-betingelse. Hvis man kan få token fra sessionStorage, så:
        if(sessionStorage.getItem('token')) {

            // så skal token'en parses til en string og angives som ny logindata
            setLoginData(JSON.parse(sessionStorage.getItem('token')))
        }
    
    // Dependency array som holder øje med ændringer i children
    }, [children])

    // Returnering af provideren hvor children af provideren kan tilgå logindata.

    return (
        // Værdi er den destructure af dataens tilstand fra provideren
        <AuthContext.Provider value={{loginData, setLoginData}}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook til at kunne kalde kontekst:
// eg. const {loginData} = useAuth();
const useAuth = () => useContext(AuthContext);

export { AuthContext, AuthProvider, useAuth }