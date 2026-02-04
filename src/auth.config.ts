import Google from "next-auth/providers/google"
import {NextAuthConfig} from "next-auth";

export default {
  providers: [Google],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
} satisfies NextAuthConfig