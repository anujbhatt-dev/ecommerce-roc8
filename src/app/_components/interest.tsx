"use client"
import { useEffect, useState } from "react"
import {api} from "~/trpc/react"

export default function() {
    const categories = api.interest.getCategories.useQuery();
    return (
        <main className="flex justify-center">
            <div className="flex flex-col items-center h-[691px] w-[578px] border rounded-[20px]  my-[30px]">
                <h1 className="text-[32px] font-semibold my-[15px]">Please mark your interests!</h1>            
                <h1 className="text-[14px] text-[#333] my-[10px] mb-[35px]">We will keep you notified.</h1>
                <div className="item-start w-[456px]">
                    <div className="text-[20px] inter font-medium mb-[17px]" >My saved interests!</div>
                    <ul>
                        {/* {JSON.stringify(categories?.data)} */}
                        {categories?.data?.map((item)=>{
                            return <div className="flex  mb-[20px] inter capitalize">
                                    <div className="mr-[10px] text-[16px] flex">
                                        {/* {item.done?
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="4" fill="black"/>
                                        <path d="M5 13L8.5 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>:
                                        } */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="4" fill="#CCCCCC"/>
                                        </svg>   
                                    </div>
                                    <span className="capitalize">{item.name}</span>
                            </div>
                        })}
                    </ul>
                </div>
                <div className="flex text-[#333333] gap-[20px] items-center mt-[30px]">
                        <button>{"<<"}</button>
                        <button>{"<"}</button>
                        <div className="flex gap-[10px]">
                            <span>1</span><span>2</span><span className="text-black">3</span><span>4</span><span>5</span><span>6</span>
                        </div>
                        <button>{">"}</button>
                        <button>{">>"}</button>
                </div>
            </div>
        </main>
    )
}
