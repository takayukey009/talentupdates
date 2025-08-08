import { notFound } from "next/navigation";
import KeystaticClient from "./KeystaticClient";

export default function Page() {
  // Enable only when explicitly allowed (e.g. on local dev or protected prod)
  const enabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true";
  if (!enabled) return notFound();
  return <KeystaticClient />;
}
