export function HeroFxOverlay({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="fx-perspective absolute inset-0">
        <div className="fx-rightfill" />
        <div className="fx-rightwash" />
        <div className="fx-blob fx-blob-a" />
        <div className="fx-blob fx-blob-b" />
        <div className="fx-blob fx-blob-c" />
        <div className="fx-grid fx-grid-a" />
        <div className="fx-ring fx-ring-a" />
      </div>
    </div>
  );
}

