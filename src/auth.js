
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import  prisma  from "@/lib/prisma"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider !== "google") return false;

      const email = user?.email || profile?.email;
      const allowed = await prisma.admin.findFirst({
        where: { email },
        select: { id: true },
      });
      console.log(allowed)

      if (!allowed) {
        console.log("Blocked login:", email);
      }

    },
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
  pages: {
    error: "/signinfail?error=not_allowed",
  },
})