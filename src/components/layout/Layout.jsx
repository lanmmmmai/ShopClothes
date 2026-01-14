import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children, title, actions }) {
  return (
    <div className="min-h-screen w-full bg-black overflow-x-hidden">
      <div className="flex min-h-screen w-full bg-black">
        <div className="flex w-full min-h-screen items-stretch">
          <Sidebar />
          <div className="flex-1 bg-neutral-100 rounded-xl">
            <div className="flex justify-between items-start self-stretch p-5">
              <span className="text-black text-2xl font-bold">{title}</span>
              {actions && <div className="flex shrink-0 items-start gap-[3px]">{actions}</div>}
            </div>
            <div className="flex items-start self-stretch">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
