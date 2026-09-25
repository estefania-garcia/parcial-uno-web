export function State({
  emoji,
  children,
}: {
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <div className="state">
      <span className="state-emoji">{emoji}</span>
      {children}
    </div>
  );
}
