export function Alert({
  type = 'error',
  children,
}: {
  type?: 'error' | 'success';
  children: React.ReactNode;
}) {
  if (!children) return null;
  return <div className={`alert alert-${type}`}>{children}</div>;
}
