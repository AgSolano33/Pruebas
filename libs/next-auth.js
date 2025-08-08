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

          // Asegurar que userType sea siempre un array
          let userTypeArray = user.userType;
          if (!userTypeArray) {
            userTypeArray = ["client", "provider"];
          } else if (!Array.isArray(userTypeArray)) {
            userTypeArray = [userTypeArray];
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            nombre: user.name ? user.name.split(' ')[0] : '',
            userType: userTypeArray,
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
    async signIn({ user, account, profile, email, credentials }) {
      // Si es un usuario nuevo de Google, establecer ambos userTypes por defecto
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Usuario nuevo: crear con ambos tipos
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              userType: ["client", "provider"]
            });
            user.userType = ["client", "provider"];
          } else {
            // Usuario existente: asegurar que tenga ambos tipos
            if (!existingUser.userType || 
                (Array.isArray(existingUser.userType) && existingUser.userType.length < 2) ||
                (!Array.isArray(existingUser.userType))) {
              await User.findOneAndUpdate(
                { email: user.email },
                { userType: ["client", "provider"] },
                { new: true }
              );
            }
            user.userType = existingUser.userType || ["client", "provider"];
          }
        } catch (error) {
          console.error("Error setting userType:", error);
          // Fallback: establecer ambos tipos
          user.userType = ["client", "provider"];
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre || (user.name ? user.name.split(' ')[0] : ''); 
        // Asegurar que userType sea siempre un array
        if (user.userType) {
          token.userType = Array.isArray(user.userType) ? user.userType : [user.userType];
        } else {
          token.userType = ["client", "provider"];
        }
      } else if (token.name) { 
        token.nombre = token.name.split(' ')[0]; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
        session.user.nombre = token.nombre; 
        // Asegurar que userType sea siempre un array en la sesión
        if (token.userType) {
          session.user.userType = Array.isArray(token.userType) ? token.userType : [token.userType];
        } else {
          session.user.userType = ["client", "provider"];
        }
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