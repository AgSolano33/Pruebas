import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import clientPromise from "./mongo";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import User from "@/models/User";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
       
        const firstName = profile.given_name || (profile.name ? profile.name.split(' ')[0] : '');

        return {
          id: profile.sub,
          name: profile.name, 
          nombre: firstName, 
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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();
          
          // Buscar usuario en la base de datos
          const user = await User.findOne({ email: credentials.email });
          
          if (!user || !user.password) {
            return null;
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            nombre: user.name ? user.name.split(' ')[0] : '',
            userType: user.userType,
          };
        } catch (error) {
          console.error("Error en autorización:", error);
          return null;
        }
      }
    }),
  ],
 
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre || (user.name ? user.name.split(' ')[0] : ''); 
        token.userType = user.userType;
      } else if (token.name) { 
        token.nombre = token.name.split(' ')[0]; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
        session.user.nombre = token.nombre; 
        session.user.userType = token.userType;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  theme: {
    brandColor: config.colors.main,
    logo: '/icon.png',
  },
};