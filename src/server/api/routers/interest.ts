import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {z} from "zod"

export const interestRouter = createTRPCRouter({
    getCategories:protectedProcedure.query(async ({ctx})=>{
        try {
            const data = await ctx.db.category.findMany()
            if(!data){
                throw new TRPCError({
                    code:"BAD_REQUEST",
                    message:"Data not found"
                })
            }
            return [...data]
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:"Something went wrong [getAll]"
            })
            
        }
    }),
    
})