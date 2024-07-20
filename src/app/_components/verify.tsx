"use client";

import { Suspense, ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';
import toast from 'react-hot-toast';

function VerifyOtp() {
    const [digits, setDigits] = useState<number[]>(Array(8).fill(-1));
    const [state, setState] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setState(emailParam);
        }else{
            router.push(`/`);
        }
    }, [searchParams]);

    const user = api.user.verify.useMutation({
        onSuccess: (res) => {
            toast.success("verified!")
            router.push(`/login`);
        },
        onError:()=>{
            toast.error("Otp did not match!")
        }
    });

    const handler = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = e.target.value;

        if (/^\d?$/.test(value)) {
            setDigits(prevState => {
                const newState = [...prevState];
                newState[idx] = value === "" ? -1 : parseInt(value);
                return newState;
            });

            if (value === "" && idx > 0) {
                document.getElementById(`input${idx - 1}`)?.focus();
            } else if (value !== "" && idx < 7) {
                document.getElementById(`input${idx + 1}`)?.focus();
            }
        }
    };

    const keyHandler = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'ArrowRight' && idx < 7) {
            document.getElementById(`input${idx + 1}`)?.focus();
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            document.getElementById(`input${idx - 1}`)?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (digits.every(digit => digit >= 0)) {
            user.mutate({
                email: state,
                otp: digits.join("").toString()
            });
        } else {
            toast.error('Please complete all 8 digits.');
        }
    };

    return (
        <main className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center h-[395px] md:w-[578px] border rounded-[20px] mx-[10px] my-[30px] p-3">
                <h1 className="text-[24px] md:text-[32px] font-semibold my-[15px]">Verify your email</h1>
                <h1 className="text-[14px] text-center leading-[19.36px] my-[10px] mb-[20px]">
                    Enter the 8 digit code you have received on <br /> {state}
                </h1>
                <label htmlFor="" className='text-[16px] inter mb-[7px] md:w-[456px]'>Code</label>
                <div className='flex gap-[10px] justify-between md:w-[456px] h-[78px]'>
                    {digits.map((i, idx) => (
                        <input
                            id={`input${idx}`}
                            key={`input${idx}`}
                            className='flex justify-center items-center text-center border-2 rounded-[6px] gap-[10px] h-[30px] w-[28px] md:gap-[30px] md:h-[48px] md:w-[46px]'
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
                    className="h-[56px] w-[256px] md:w-[456px] inter font-medium text-white bg-black rounded-[6px] mt-[40px]"
                >
                    VERIFY
                </button>
            </form>
        </main>
    );
}

export default function Verify() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOtp />
        </Suspense>
    );
}
