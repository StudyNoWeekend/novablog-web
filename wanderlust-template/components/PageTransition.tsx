export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-transition animate-page-fade-in flex flex-1 flex-col">
      {children}
    </div>
  );
}
