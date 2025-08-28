import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongo";
import { connectToDatabase } from "./mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Role from "@/models/Role";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: credentials.email }).populate("roles", "name");
    if (!user || !user.password) throw new Error("Email o contraseña incorrectos");

    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) throw new Error("Email o contraseña incorrectos");

    if (!user.verified) throw new Error("Debes verificar tu correo antes de iniciar sesión");

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles.map(r => r.name),
      hasAccess: user.hasAccess,
    };
  } catch (error) {
    console.error("Error en authorize:", error);
    throw error; // lanzamos el error para que next-auth lo pase al frontend
  }
}


    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();

        let existingUser = await User.findOne({ email: user.email });
        const clienteRole = await Role.findOne({ name: "cliente" });
        if (!clienteRole) throw new Error("Rol 'cliente' no existe");

        if (!existingUser) {
          // Crear usuario nuevo
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            roles: [clienteRole._id],
            hasAccess: true,
            verified: true, // Google se considera verificado
          });
        } else if (!existingUser.roles || existingUser.roles.length === 0) {
          // Asignar rol por defecto si no tiene
          existingUser.roles = [clienteRole._id];
          existingUser.hasAccess = true;
          await existingUser.save();
        }

        // Poblar roles para la sesión
        const populatedUser = await User.findById(existingUser._id).populate("roles", "name");
        user.roles = populatedUser.roles.map(r => r.name);
        user.hasAccess = populatedUser.hasAccess;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles || [];
        token.hasAccess = user.hasAccess ?? true;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles || [];
        session.user.hasAccess = token.hasAccess ?? true;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: "/login",
  },
};
