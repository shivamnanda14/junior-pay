import { getCurrentUser } from "@/lib/session";
import LandingClient from "./LandingClient";

export default async function LandingPage() {
  const session = await getCurrentUser();
  
  // Pass the server-fetched session into our interactive client component
  return <LandingClient session={session} />;
}