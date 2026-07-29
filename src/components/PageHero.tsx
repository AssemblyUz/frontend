export default function PageHero({title, lead}: {title: string; lead: string}) {
  return (
    <section className="relative overflow-hidden border-b border-border-base">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent" />
      <div className="relative shell py-section">
        <h1 className="text-fluid-4xl font-bold tracking-tight text-foreground text-balance">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-fluid-lg text-muted">{lead}</p>
      </div>
    </section>
  );
}
