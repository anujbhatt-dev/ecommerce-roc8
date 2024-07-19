"use client"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
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

    const pageHandler = (opretion:string)=>{
        if(opretion==">" && Math.floor((categories?.data?.length as number)/6)>page){
            setPage(page+1)
        }
        if(opretion==">>"){
            setPage(Math.floor((categories?.data?.length as number)/6))
        }
        if(opretion=="<" && page>=1){
            setPage(page-1)
        }
        if(opretion=="<<"){
            setPage(0)
        }
        
    }
    
    useEffect(()=>{
        console.log(page);
    },[page])

    return (
        <main className="flex justify-center">
            <Toaster
            position="top-right"
            reverseOrder={false}
            />
            <div className="flex flex-col items-center h-[691px] md:w-[578px] border rounded-[20px]  my-[30px] px-3">
                <h1 className="text-[24px] md:text-[32px] font-semibold my-[15px] text-center">Please mark your interests!</h1>            
                <h1 className="text-[14px] text-[#333] my-[10px] mb-[35px]">We will keep you notified.</h1>
                <div className="item-start w-full md:w-[456px]">
                    <div className="text-[20px] inter font-medium mb-[17px]" >My saved interests!</div>
                    <ul className="h-[291px]">
                        {/* {JSON.stringify(categories?.data)} */}
                        {categories?.data?.slice(page*6,(page*6)+6).map((item)=>{
                            return <div key={item.id} className="flex  mb-[20px] inter capitalize">
                                    <div className="mr-[10px] text-[16px] flex">
                                        {myCategories?.data?.includes(item.id)?
                                        <svg className="cursor-pointer" onClick={()=>{removeCategory(item.id);toast.success("Updating Interest!")}} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="4" fill="black"/>
                                        <path d="M5 13L8.5 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>:
                                        <svg  className="cursor-pointer" onClick={()=>{setCategory(item.id);toast.success("Updating Interest!")}}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <button className=" cursor-pointer" onClick={()=>pageHandler("<<")}>{"<<"}</button>
                        <button className=" cursor-pointer" onClick={()=>pageHandler("<")}>{"<"}</button>
                        
                        <div className={"flex gap-3"}>
                            {new Array(7).fill(-1).map((item,idx)=>{
                                if(page+1+idx<=Math.floor((categories?.data?.length as number)/6)+1)
                                    return <span className={idx==0?"font-bold cursor-pointer":" cursor-pointer"} onClick={()=>{setPage(page+idx)}} key={`pagi${idx}`}>{page+1+idx}</span>
                            })}
                        </div>
                        
                        <button className=" cursor-pointer" onClick={()=>pageHandler(">")}>{">"}</button>
                        <button className=" cursor-pointer" onClick={()=>pageHandler(">>")}>{">>"}</button>
                </div>
            </div>
        </main>
    )
}
