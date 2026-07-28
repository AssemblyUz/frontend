export default function PageHero({title, lead}: {title: string; lead: string}) {
  return (
    <section className="relative overflow-hidden border-b border-border-base">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{lead}</p>
      </div>
    </section>
  );
}
