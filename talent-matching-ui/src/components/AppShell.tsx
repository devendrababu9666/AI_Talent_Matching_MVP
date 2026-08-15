import type { ReactNode } from "react";
 
type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};
 
export default function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>
 
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
              {subtitle}
            </p>
          ) : null}
        </div>
 
        {children}
      </section>
    </main>
  );
}
 