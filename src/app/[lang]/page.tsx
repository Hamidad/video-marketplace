import { Feed } from "@/components/ui/feed";
import { Locale } from "../../../i18n-config";

export default async function Home({
  params,
}: {
  params: Promise<any>;
}) {
  const { lang } = await params;
  return (
    <main className="h-screen w-full bg-black">
      <Feed />
    </main>
  );
}
