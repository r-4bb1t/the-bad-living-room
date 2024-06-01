export default async function Room({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <main className="pt-24 pb-12 px-8 min-h-screen flex flex-col items-center justify-between gap-4">
      <div className="italic text-lg">여기는 의상한거실...</div>
    </main>
  );
}
