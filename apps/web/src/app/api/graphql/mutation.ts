import { SiteDiary } from '@/data/site-diary';
import connectDB from '@/lib/mongodb';
import SiteDiaryModel from '@/models/SiteDiary';
import type { Int } from 'grats';

/** @gqlInput */
interface SiteDiaryInput {
  id: string;
  date: string;
  createdBy: string;
  title: string;
  content?: string;
  weather?: WeatherInput;
  attendees?: string[];
  attachments?: string[];
}

/** @gqlInput */
interface WeatherInput {
  description: string;
  temperature: Int;
}

/** @gqlMutationField */
export async function createSiteDiary(
  input: SiteDiaryInput,
): Promise<SiteDiary> {
  await connectDB();

  const siteDiary = await SiteDiaryModel.create(input);

  return {
    id: siteDiary.id,
    date: siteDiary.date,
    title: siteDiary.title,
    createdBy: siteDiary.createdBy,
    content: siteDiary.content,
    weather: siteDiary.weather,
    attendees: siteDiary.attendees,
    attachments: siteDiary.attachments,
  };
}
