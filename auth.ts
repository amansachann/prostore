import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          // If password is correct
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // If user doesn't exist or the password doesn't match, return null
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token, user, trigger }: any) {
      // Set the user id from token
      session.user.id = token.sub as string;
      session.user.role = token.role;
      session.user.name = token.name;

      // If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      // Assign user field to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // If user has no name, then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];
          // Update the database to reflect the token name
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: token.name,
            },
          });
          if (trigger === "signIn" || trigger === "signUp") {
            const cookiesObject = await cookies();
            const sessionCartId = cookiesObject.get("sessionCartId")?.value;
            if (sessionCartId) {
              const sessionCart = await prisma.cart.findFirst({
                where: {
                  sessionCartId: sessionCartId,
                },
              });
              if (sessionCart) {
                // Delete Current User
                await prisma.cart.deleteMany({
                  where: {
                    userId: user.id,
                  },
                });
                // Assign new cart
                await prisma.cart.update({
                  where: {
                    id: sessionCart.id,
                  },
                  data: {
                    userId: user.id,
                  },
                });
              }
            }
          }
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }: any) {
      // check for session cart cookie
      if (!request.cookie?.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();
        // Clone request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
});
