'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Database,
  FileText,
  Clock,
  Factory,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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

// Sidebar content component (reused in both desktop and mobile)
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14" onClick={onLinkClick}>
          <Factory className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-2xl font-bold">CxO Playbook</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onLinkClick}
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

// Main Sidebar component
export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:border-r">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <Factory className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-xl font-bold">CxO Playbook</h1>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              {/* ✅ FIX: Add hidden title for accessibility */}
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <SidebarContent onLinkClick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-16" />
    </>
  );
}
