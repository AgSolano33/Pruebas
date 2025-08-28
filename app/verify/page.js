import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="p-6 max-w-md rounded-2xl shadow-lg bg-white text-center">
            <p className="text-gray-500">Cargando…</p>
          </div>
        </main>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
