"use client"
import { useEffect, useState } from "react"
import {api} from "~/trpc/react"

export default function Interest() {
    const [page,setPage] = useState(0)
    const setInterest = api.user.setCategoryInterest.useMutation({
        onSettled:() => myCategories.refetch()
    })
    const removeInterest = api.user.removeCategoryInterest.useMutation({
        onSettled:() => myCategories.refetch()
    })
    const categories = api.interest.getCategories.useQuery();
    const myCategories = api.user.getMyCategories.useQuery()

    const setCategory = (id:number) => {
        setInterest.mutate(id)
    }

    const removeCategory = (id:number) => {
        removeInterest.mutate(id)
    }

    return (
        <main className="flex justify-center">
            <div className="flex flex-col items-center h-[691px] w-[578px] border rounded-[20px]  my-[30px]">
                <h1 className="text-[32px] font-semibold my-[15px]">Please mark your interests!</h1>            
                <h1 className="text-[14px] text-[#333] my-[10px] mb-[35px]">We will keep you notified.</h1>
                <div className="item-start w-[456px]">
                    <div className="text-[20px] inter font-medium mb-[17px]" >My saved interests!</div>
                    <ul>
                        {/* {JSON.stringify(categories?.data)} */}
                        {categories?.data?.slice(page*6,(page*6)+6).map((item)=>{
                            return <div key={item.id} className="flex  mb-[20px] inter capitalize">
                                    <div className="mr-[10px] text-[16px] flex">
                                        {myCategories?.data?.includes(item.id)?
                                        <svg className="cursor-pointer" onClick={()=>removeCategory(item.id)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="4" fill="black"/>
                                        <path d="M5 13L8.5 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>:
                                        <svg  className="cursor-pointer" onClick={()=>setCategory(item.id)}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="4" fill="#CCCCCC"/>
                                        </svg>   
                                        }
                                    </div>
                                    <span className="capitalize">{item.name}</span>
                            </div>
                        })}
                    </ul>
                </div>
                <div className="flex text-[#333333] gap-[20px] items-center mt-[30px]">
                        <button onClick={()=>setPage(0)}>{"<<"}</button>
                        <button onClick={()=>setPage(0)}>{"<"}</button>
                        <div className="flex gap-[10px]">
                            {new Array(7).map((i,idx)=>{
                                return <span onClick={()=>setPage(page+idx)} key={`pagenumber${idx}`}>{page+idx}</span>
                            })}
                        </div>
                        <button onClick={()=>setPage(page=>page+1)}>{">"}</button>
                        <button onClick={()=>setPage(Math.floor((categories?.data?.length as number)/6))}>{">>"}</button>
                </div>
            </div>
        </main>
    )
}
