import { useMemo } from "react";

import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const wrapperClass = useMemo(
    () => `min-h-screen bg-white dark:bg-surface-950 text-secondary-900 dark:text-slate-100 transition-colors duration-300`,
    []
  );

  return (
    <div className={wrapperClass}>
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
