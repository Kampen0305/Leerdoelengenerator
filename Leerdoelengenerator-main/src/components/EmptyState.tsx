import { ReactNode } from 'react';

export default function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="border rounded-xl p-6 text-center opacity-70">
      {children}
    </div>
  );
}
