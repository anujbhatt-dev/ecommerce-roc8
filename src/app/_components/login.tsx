"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import FormItem from "./formItem"
import Switch from "./switch"
import {api} from "~/trpc/react"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie" 
import { useUserContext } from "~/context";
import {env} from "~/env"

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" })
  const {setUser} = useUserContext();
  const router = useRouter()
  const user = api.user.login.useMutation({
    onSuccess:(res)=>{
        setUser({
          name:res.name,
          email:res.email,
          id:res.id
        }) 
        setFormData({ email: "", password: "" })
        console.log(res);
        //set cookie named token here
        Cookies.set('token', res.token , { expires: 1, secure: true, sameSite: 'strict' });
        router.push("/interest")
    },
    onError:(error)=>{
      setFormData({ email: "", password: "" })
      console.log("error");
      
    }
  })

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>{
    const { name, value } = e.target;
    setFormData(prevState=> {return { ...prevState, [name]: value }});
  }

  const submitHandler = ( e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    console.log(formData);
    user.mutate(formData);
  }


  return (
    <main className="flex justify-center">
        <form onSubmit={submitHandler} className="flex flex-col items-center h-[691px] w-[578px] border rounded-[20px]  my-[30px]">          
            <h1 className="text-[32px] font-semibold my-[15px]">Login</h1>
            <h1 className="text-[18px] font-semibold my-[10px]">Welcome to back ECOMMERCE</h1>
            <h1 className="text-[14px] text-[#333] my-[10px] mb-[20px]">The next gen business market place</h1>
            <FormItem onChange={changeHandler} inputType="email" placeholder="enter your email" label="email" value={formData.email}/>
            <FormItem onChange={changeHandler} inputType="password" placeholder="enter your password" label="password" value={formData.password}/>
            <button className="h-[56px] w-[456px] inter font-medium text-white bg-black rounded-[6px] mt-[40px]">LOGIN</button>
            <Switch text="Don't have an Account" route=""/>
        </form>
    </main>
  )
}
