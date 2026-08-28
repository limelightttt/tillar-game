import { TillarLogo } from "@/shared/ui";

export function AppRouter() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
        <TillarLogo className="mx-auto mb-6" />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">TILLAR Games</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Интеллектуальные игры</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Браузерная платформа подготовлена к подключению игровых механик.
        </p>
      </section>
    </main>
  );
}
