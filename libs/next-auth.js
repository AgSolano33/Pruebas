import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import clientPromise from "./mongo";

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
  ],
 
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre || (user.name ? user.name.split(' ')[0] : ''); 
      } else if (token.name) { 
        token.nombre = token.name.split(' ')[0]; 
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
        session.user.nombre = token.nombre; 
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