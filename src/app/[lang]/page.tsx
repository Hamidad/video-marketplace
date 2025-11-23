import { HomeClient } from "@/components/home-client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Home({
  params,
}: {
  params: any;
}) {
  // We still await params to ensure we're in the async context if needed later
  await params;

  return (
    <main className="h-screen w-full bg-black">
      <HomeClient />
    </main>
  );
}
