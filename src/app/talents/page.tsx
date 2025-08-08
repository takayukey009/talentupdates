import { getTalents } from "@/lib/getTalents";
import TalentReport, { UITalent } from "@/components/TalentReport";

export const dynamic = "force-static";

export default async function Page() {
  const talents = await getTalents();
  return <TalentReport talents={talents as unknown as UITalent[]} />;
}
