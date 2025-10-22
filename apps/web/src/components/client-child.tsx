'use client';

import { SiteDiaryList } from '@/components/site-diary/list';
import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
} from '@/types/__generated__/graphql';
import { useSuspenseQuery } from '@apollo/client/react';
import { SITE_DIARIES } from '../graphql/queries';

export const ClientChild: React.FC = () => {
  const { data } = useSuspenseQuery<
    SiteDiariesQuery,
    SiteDiariesQueryVariables
  >(SITE_DIARIES);

  return <SiteDiaryList diaries={data.siteDiaries || []} />;
};
