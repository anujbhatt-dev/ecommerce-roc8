import { z } from "zod";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {env} from "~/env"
import otpGenerator from "otp-generator"
import {transporter} from "~/server/transporter"

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { verify } from "crypto";

export const userRouter = createTRPCRouter({
  create: publicProcedure.input(z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string()
  })).mutation(async ({ctx,input})=>{
        const {name,email,password} = input
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          console.log(input);
          const createdUser = await ctx.db.user.create({
            data: {
              name,
              email,
              password: hashedPassword
            },
          });
          const otp = otpGenerator.generate(8,{digits:true, lowerCaseAlphabets:false,upperCaseAlphabets:false, specialChars:false})
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
          
          const crteOtp = await ctx.db.otp.create({
            data:{
              otp:otp,
              expiresAt,
              userId:createdUser.id
            }
          })
          console.log(otp);
          
          const verification = await transporter.sendMail({
            from: env.SMTP_EMAIL,
            to: email,
            subject: 'Your verification code',
            text: `Here is your verification code: ${otp}`,
            html: `<p>Here is your verification code: <b>${otp}</b></p>`,
          });
          console.log(verification.response);
          
          return {
            message: "User created successfully!"
          };
        } catch (error) {
          console.error("Error creating user:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user"
          });
        }
  }),

  verify:publicProcedure.input(z.object({otp:z.string().length(8),email:z.string().email()})).mutation(async ({ctx,input})=>{
        const otp = parseInt(input.otp)
        try {
          const user = await ctx.db.user.findUnique({
            where:{
              email:input.email
            }
          })
          if(!user){
            throw new TRPCError({
              code:"UNAUTHORIZED",
              message:"user not found"
            })
          }
          const otpQuery = await ctx.db.otp.findFirst({
            where:{
              userId:user.id
            }
          })
          if(!otpQuery){
            throw new TRPCError({
              code:"UNAUTHORIZED",
              message:"OTP not found"
            })
          }
  
          if(otp===parseInt(otpQuery.otp,10)){
              await ctx.db.user.update({
                where:{
                  id:user.id
                },
                data:{
                  isVerified:true
                }
              })
          }else{
            throw new TRPCError({
              code:"UNAUTHORIZED",
              message:"invalid OTP"
            })
          }
          return {
              success:true
          }
        } catch (error) {
          if(error instanceof TRPCError){
            throw error
          }else{
            throw new TRPCError({
              code:"INTERNAL_SERVER_ERROR",
              message:"server error"
            })
          }

        }
        
  }),

  login:publicProcedure.input(z.object({
    email:z.string().email(),
    password:z.string()
  })).mutation(async ({ctx,input})=>{
      const {email,password} = input
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            email
          }
        });
  
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found"
          });
        }
  
        const hash = await bcrypt.compare(password, user.password);
        if (!hash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect password"
          });
        }
  
        const token = jwt.sign({ userId: user.id, name: user.name }, env.JWT_SECRET, { expiresIn: "1h" });
        
        

  
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          token
        };
      } catch (error) {
        console.error("Login error:", error);
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Login failed"
          });
        }
      }
  }),
});
