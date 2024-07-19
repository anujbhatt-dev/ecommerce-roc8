"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "~/context";
import { api } from "~/trpc/react"

export default function Profile(){
    const router = useRouter();
    const {user,setUser} = useUserContext()
    const auth = api.user.visited.useMutation({
        onSuccess:(res)=>{
        setUser({
            name:res.name,
            email:res.email,
            id:res.id
        }) 
        router.push("/interest")
        },
        onError:(e)=>{
            console.log(e);
            
        }
    })
    useEffect(()=>{
        console.log(document.cookie);
        
        auth.mutate()
    },[])

    const handleLogout = () =>{
        Cookies.remove("token")
        setUser({
            name:"",
            email:"",
            id:-1
        })
        router.push("/login")
    }
    return <div className="flex gap-5 items-center mx-2 md:m-0"> {user.name!=""?`Hi, ${user.name}`:""} {user.name!=""?<button onClick={handleLogout} className="border bg-black text-white py-1 px-2 rounded">Logout</button>:null}</div>
} 