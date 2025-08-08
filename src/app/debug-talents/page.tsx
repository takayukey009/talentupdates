import { getTalents } from "@/lib/getTalents";

export const dynamic = "force-static"; // read from filesystem at build/runtime

export default async function Page() {
  const talents = await getTalents();
  return (
    <div style={{ padding: 20 }}>
      <h1>Debug Talents</h1>
      <pre>{JSON.stringify(talents, null, 2)}</pre>
    </div>
  );
}
