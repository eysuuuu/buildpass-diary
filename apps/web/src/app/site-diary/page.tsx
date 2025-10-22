import { ClientChild } from '@/components/client-child';
import { SITE_DIARIES } from '@/graphql/queries';
import { PreloadQuery } from '@/lib/apollo-client';
import { Suspense } from 'react';

export default function SiteDiaryPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">
        <PreloadQuery query={SITE_DIARIES}>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <div className="text-muted-foreground animate-pulse text-sm sm:text-base">
                  Loading site diaries...
                </div>
              </div>
            }
          >
            <ClientChild />
          </Suspense>
        </PreloadQuery>
      </main>
    </div>
  );
}
