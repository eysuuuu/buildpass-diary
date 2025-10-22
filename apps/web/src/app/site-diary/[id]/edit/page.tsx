import { SiteDiaryForm } from '@/components/site-diary/form';
import { SITE_DIARY } from '@/graphql/queries';
import { getClient } from '@/lib/apollo-client';
import type { SiteDiaryQuery } from '@/types/__generated__/graphql';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface EditSiteDiaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSiteDiaryPage({
  params,
}: EditSiteDiaryPageProps) {
  const { id } = await params;

  const { data } = await getClient().query<SiteDiaryQuery>({
    query: SITE_DIARY,
    variables: { id },
  });

  if (!data?.siteDiary) {
    notFound();
  }

  const diary = {
    ...data.siteDiary,
    content: data.siteDiary.content ?? undefined,
    weather: data.siteDiary.weather ?? undefined,
    attendees: data.siteDiary.attendees ?? undefined,
    attachments: data.siteDiary.attachments ?? undefined,
  };

  return (
    <div className="bg-background min-h-screen">
      <SiteDiaryForm diary={diary} isEditing={true} />
    </div>
  );
}
