import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .single();

          if (error || !users) {
            throw new Error("User not found");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            users.password_hash
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          if (!users.email_verified) {
            throw new Error("Email not verified");
          }

          // Update last login
          await supabase
            .from("users")
            .update({ last_login: new Date().toISOString() })
            .eq("id", users.id);

          return {
            id: users.id,
            email: users.email,
            name: users.name,
            image: users.avatar_url,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
