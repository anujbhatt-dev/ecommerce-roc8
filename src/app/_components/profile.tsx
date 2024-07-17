"use client";
import { useUserContext } from "~/context";

export default function(){
    const {user} = useUserContext()
    return <div>Hi, {user.name}</div>
} 