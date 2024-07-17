"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import {api} from "~/trpc/react"

export default function Verify() {
    const [digits, setDigits] = useState<number[]>(Array(8).fill(-1));
    const [state,setState] = useState<string>("")
    const router = useRouter();
    const searchParams = useSearchParams()

    useEffect(()=>{
        const emailParam = searchParams.get('email')
        if (emailParam) {
            setState(emailParam);
        }
    },[searchParams])

    const user = api.user.verify.useMutation({
        onSuccess:(res)=>{  
            console.log(res);
            router.push(`/login`)
            }
    })


    // Handle the change event for each input field
    const handler = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = e.target.value;
                
        
        // Ensure the value is a digit or empty
        if (/^\d?$/.test(value)) {
            setDigits(prevState => {
                const newState = [...prevState];
                newState[idx] = value === "" ? -1 : parseInt(value);
                return newState;
            });

            // Focus management
            if (value === "" && idx > 0) {
                document.getElementById(`input${idx - 1}`)?.focus();
            } else if (value !== "" && idx < 7) {
                document.getElementById(`input${idx + 1}`)?.focus();
            }
        }
    }

    // Handle keyboard events for navigation
    const keyHandler = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'ArrowRight' && idx < 7) {
            document.getElementById(`input${idx + 1}`)?.focus();
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            document.getElementById(`input${idx - 1}`)?.focus();
        }
    }

    // Dummy submit handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        user.mutate({
            email:state,
            otp:digits.join("").toString()
        })
        // Check if all digits are filled
        if (digits.every(digit => digit >= 0)) {
            
            // You can replace the alert with actual form submission logic
        } else {
            alert('Please complete all 8 digits.');
        }
    }

    return (
        <main className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center h-[395px] w-[578px] border rounded-[20px] my-[30px]">
                <h1 className="text-[32px] font-semibold my-[15px]">Verify your email</h1>
                <h1 className="text-[14px] text-center leading-[19.36px] my-[10px] mb-[20px]">
                    Enter the 8 digit code you have received on <br /> {state}
                </h1>
                <label htmlFor="" className='text-[16px] inter mb-[7px] w-[456px]'>Code</label>
                <div className='flex justify-between w-[456px] h-[78px]'>
                    {digits.map((i, idx) => (
                        <input
                            id={`input${idx}`}
                            key={`input${idx}`}
                            className='flex justify-center items-center text-center border rounded-[6px] gap-[10px] h-[48px] w-[46px]'
                            type="tel"
                            maxLength={1}
                            value={i === -1 ? "" : i}
                            onChange={(e) => handler(e, idx)}
                            onKeyDown={(e) => keyHandler(e, idx)}
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    className="h-[56px] w-[456px] inter font-medium text-white bg-black rounded-[6px] mt-[40px]"
                >
                    VERIFY
                </button>
            </form>
        </main>
    )
}
