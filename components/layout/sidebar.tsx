'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Database,
  FileText,
  Clock,
  Factory,
} from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Master Data',
    icon: Database,
    href: '/admin/masters',
    color: 'text-violet-500',
  },
  {
    label: 'Production Entry',
    icon: FileText,
    href: '/entry/production',
    color: 'text-pink-700',
  },
  {
    label: 'Downtime Entry',
    icon: Clock,
    href: '/entry/downtime',
    color: 'text-orange-700',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <Factory className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold">CxO Playbook</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent rounded-lg transition',
                pathname === route.href ? 'bg-accent' : 'transparent'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
