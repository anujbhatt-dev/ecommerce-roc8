import Link from "next/link"
import React from 'react'

type Route = {
    route:string,
    text:string
}

export default function Switch({route,text}:Route) {
  return (
    <p className="mt-[40px] inter">
        <span className="text-[16px] text-[#333333] ">{text}</span>
        <span className="ml-2"><Link className="capitalize font-medium tracking-widest" href={`/${route.toLowerCase()}`}> {route=="" ? "REGISTER" : "LOGIN"} </Link></span>
    </p>
  )
}
