'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DiaryItem } from './diary-item';

interface Weather {
  temperature: number;
  description: string;
}

interface SiteDiary {
  id: string;
  date: string;
  title: string;
  content?: string | null;
  createdBy: string;
  weather?: Weather | null;
  attendees?: string[] | null;
  attachments?: string[] | null;
}

interface SiteDiaryListProps {
  diaries: SiteDiary[];
}

export function SiteDiaryList({ diaries }: SiteDiaryListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiaries = diaries.filter(
    (diary) =>
      diary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diary.content?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-6 shadow-sm sm:p-8 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h1 className="text-foreground mb-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
                📋 Site Diaries
              </h1>
              <p className="text-muted-foreground mb-3 text-sm sm:text-base lg:text-lg">
                Track daily progress and activities on your construction site
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-cyan-700 shadow-sm dark:bg-gray-800/80 dark:text-cyan-300">
                  <Calendar className="h-4 w-4" />
                  {filteredDiaries.length}{' '}
                  {filteredDiaries.length === 1 ? 'entry' : 'entries'}
                </span>
                {searchTerm && (
                  <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-blue-700 shadow-sm dark:bg-gray-800/80 dark:text-blue-300">
                    <Search className="h-4 w-4" />
                    Searching...
                  </span>
                )}
              </div>
            </div>
            {/* Desktop New Entry Button */}
            <Link href="/site-diary/new" className="hidden sm:block">
              <Button
                className="flex items-center justify-center gap-2 shadow-lg"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 lg:mb-8">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="🔍 Search diaries by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 pr-4 pl-12 text-sm shadow-sm sm:text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Diaries List */}
        <div className="flex flex-col space-y-4 lg:space-y-5">
          {filteredDiaries.length === 0 ? (
            <Card className="border-dashed py-16 text-center sm:py-20">
              <CardContent>
                <div className="mx-auto max-w-md space-y-4">
                  {searchTerm ? (
                    <>
                      <div className="text-6xl">🔍</div>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        No diaries match your search
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Try different keywords or clear your search
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl">📝</div>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        No site diaries yet
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Start documenting your construction site progress
                      </p>
                      <Link href="/site-diary/new">
                        <Button className="mt-4 shadow-md" size="lg">
                          <Plus className="mr-2 h-5 w-5" />
                          Create your first entry
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredDiaries.map((diary) => (
              <DiaryItem key={diary.id} diary={diary} formatDate={formatDate} />
            ))
          )}
        </div>
      </div>

      {/* Mobile FAB (Floating Action Button) */}
      <Link
        href="/site-diary/new"
        className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6 sm:hidden"
      >
        <Button
          size="lg"
          className="group h-16 w-16 rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-2xl active:scale-95"
          title="Create new diary entry"
        >
          <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
        </Button>
      </Link>
    </div>
  );
}
