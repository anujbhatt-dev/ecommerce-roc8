"use client"
import Link from "next/link";
import Cookies from "js-cookie";



// import { LatestPost } from "~/app/_components/post";
import Form from "./_components/form"
import { useEffect, useState } from "react";

export default async function Home() {
  // const hello = await api.user.create();
  // const [token,setToken] = useState()
  // useEffect(()=>{
  //     const cookie = Cookies.get("token")
  //     console.log(cookie);
  //     setToken(token)
  // },[token])

  return (
    <main className="flex justify-center">
          <Form/>
    </main>
  );
}




