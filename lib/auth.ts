import type { User, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import type { NextAuthOptions } from "next-auth"

// Extend JWT type to include userId and role
// declare module "next-auth/jwt" {
//   interface JWT {
//     userId?: string
//     role: string
//   }
// }

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = (user as any).role
        token.userId = (user as any).id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && typeof session.user === "object") {
        (session.user as any).id = token.userId as string
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: typeof process !== "undefined" ? process.env.NEXTAUTH_SECRET : undefined,
}
  
