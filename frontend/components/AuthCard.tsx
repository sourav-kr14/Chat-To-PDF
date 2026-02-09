import { ReactNode } from "react";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="glass w-full max-w-md rounded-2xl border border-white/10 
      bg-white/5 p-8 shadow-xl">
      {children}
    </div>
  );
}
