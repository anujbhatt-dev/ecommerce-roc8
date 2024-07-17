"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react"

export type User = {
    id:number,
    name:string,
    email:string,
}

interface UserContextType {
    user: User,
    setUser: Dispatch<SetStateAction<User>>
}

const defaultState = {
    user:{
        id:-1,
        name:"",
        email:"",
    },
    setUser: () => {}
} as UserContextType

export const UserContext = createContext(defaultState)

export function UserProvider({children}:{
    children : ReactNode
}){
    const [user,setUser] = useState<User>({
        id:-1,
        name:"",
        email:"",
    })

    return <UserContext.Provider value={{user,setUser}}>
            {children}
    </UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)