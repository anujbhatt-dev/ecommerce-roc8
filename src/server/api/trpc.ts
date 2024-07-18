/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import Cookies from "js-cookie";

import { env } from "~/env";
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
    
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

export const publicProcedure = t.procedure;

interface DecodedToken extends JwtPayload {
  userId: number;
}

export const protectedProcedure = publicProcedure.use(async ({ctx,next}) => {
  // const { ctx  } = opts;

  const keyValuePairs = ctx.headers.get("cookie")?.split(';');

// Step 2: Initialize a variable to store the token value
  let token = null;

  // Step 3: Iterate over keyValuePairs to find the token value
  keyValuePairs?.forEach(pair => {
      const [key, value] = pair.split('=');
      if (key?.trim() === "token") {
          token = value?.trim(); // Extract the token value
      }
  });
  
  
  // const token = ctx.headers.get("cookie")?.split('=')[1]
  // console.log(token,headers);
  
  
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authorized"
    });
  }
  
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as DecodedToken
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authorized decode"
    });
  }
  
  if (!decoded) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authorized"
    });
  }

  const user = await ctx.db.user.findUnique({
    where: {
      id: decoded.userId 
    }
  });
  
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not authorized"
    });
  }

  return next({
    ctx: {
      ...ctx,
      user
    },
  });
});




/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
