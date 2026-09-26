import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        isRegister: { label: "isRegister", type: "text" },
        isGoogleAuth: { label: "isGoogleAuth", type: "text" },
        image: { label: "Image", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Elektron pochta manzili kiritilishi shart.");
        }

        const email = credentials.email.trim().toLowerCase();
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        const cleanName = credentials.name && credentials.name !== "undefined"
          ? credentials.name.trim()
          : email.split("@")[0];
        const cleanRole = credentials.role && credentials.role !== "undefined"
          ? credentials.role
          : "BUYER";

        // Registration flow
        if (credentials.isRegister === "true") {
          if (existingUser) {
            throw new Error("Ushbu email bilan akkaunt mavjud. Iltimos, tizimga kiring.");
          }
          if (!credentials.password || credentials.password.length < 6) {
            throw new Error("Parol kamida 6 belgidan iborat bo'lishi kerak.");
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await prisma.user.create({
            data: {
              email,
              name: cleanName,
              password: hashedPassword,
              role: cleanRole,
              provider: "credentials",
            },
          });
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            image: newUser.profilePicture,
          };
        }

        // Login flow
        if (!credentials.password) {
          throw new Error("Parol kiritilishi shart.");
        }

        if (!existingUser) {
          throw new Error("Bunday email bilan akkaunt topilmadi. Iltimos, oldin ro'yxatdan o'ting.");
        }

        if (existingUser.password) {
          const isPasswordValid = await bcrypt.compare(credentials.password, existingUser.password);
          if (!isPasswordValid) {
            throw new Error("Kiritilgan parol noto'g'ri.");
          }
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role || "BUYER",
          image: existingUser.profilePicture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          if (!user.email) return false;
          const existing = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existing) {
            const created = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email.split("@")[0],
                profilePicture: user.image,
                provider: "google",
                role: "BUYER",
              },
            });
            user.id = created.id;
            (user as any).role = created.role;
          } else {
            user.id = existing.id;
            (user as any).role = existing.role || "BUYER";
            if (!existing.profilePicture && user.image) {
              await prisma.user.update({
                where: { id: existing.id },
                data: { profilePicture: user.image },
              });
            }
          }
          return true;
        } catch (err) {
          console.error("Google signIn error:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "BUYER";
        token.picture = user.image || (user as any).profilePicture;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.role) token.role = session.role;
        if (session.image) token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || "BUYER";
        if (token.picture) {
          (session.user as any).image = token.picture;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

