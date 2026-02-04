
import NextAuth from "next-auth"
import authConfig from "./auth.config";
import { PrismaClient }  from "@prisma/client"

const prisma = new PrismaClient();


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!account || account.provider !== "google") {
        return false;
      }

      const email = user?.email || profile?.email;
      const allowed = await prisma.admin.findFirst({
        where: { email },
        select: { id: true },
      });
      console.log(allowed)

      if (!allowed) {
        console.log("Blocked login:", email);
      }

      return true

    },
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
  pages: {
    error: "/signinfail?error=not_allowed",
  },
})