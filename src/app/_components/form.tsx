"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import FormItem from "./formItem"
import Switch from "./switch"

import {api} from "~/trpc/react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Form() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "" })
  const router = useRouter()

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>{
    const { name, value } = e.target;
    setFormData(prevState=> {return { ...prevState, [name]: value }}); 
  }

  const user = api.user.create.useMutation({
    onSuccess:(res)=>{  
      const query = new URLSearchParams({email:formData.email}).toString();
      toast.success("success")
      router.push(`/verify?${query}`)
      setFormData({ name: "", email: "", password: "" })
    },
    onError:(error)=>{
        toast.error(error.message)
    }
  });
  
  const submitHandler = ( e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    console.log(formData );
    user.mutate(formData);
  }

  return (
    <form onSubmit={submitHandler} className="flex flex-col items-center h-[691px] md:w-[578px] p-3 border rounded-[20px] my-[30px]">
        <h1 className="text-[24px] md:text-[32px] font-semibold my-[20px]">Create Your Account</h1>
        <FormItem onChange={changeHandler} inputType="text" placeholder="enter your name" label="name" value={formData.name}/>
        <FormItem onChange={changeHandler} inputType="email" placeholder="enter your email" label="email" value={formData.email}/>
        <FormItem onChange={changeHandler} inputType="password" placeholder="enter your password" label="password" value={formData.password}/>
        <button className="h-[56px] w-[256px] md:w-[456px] inter font-medium text-white bg-black rounded-[6px] mt-[40px] ">CREATE AN ACCOUNT</button>
        <Switch text="Having an Account?" route="LOGIN"/>
    </form>
  )
}
