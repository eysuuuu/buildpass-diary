import { SiteDiary } from '@/data/site-diary';
import connectDB from '@/lib/mongodb';
import SiteDiaryModel from '@/models/SiteDiary';

/** @gqlQueryField */
export async function siteDiaries(): Promise<Array<SiteDiary>> {
  await connectDB();

  const diaries = await SiteDiaryModel.find({}).sort({ date: -1 }).lean();

  return diaries.map((diary) => ({
    id: diary.id,
    date: diary.date,
    title: diary.title,
    createdBy: diary.createdBy,
    content: diary.content,
    weather: diary.weather,
    attendees: diary.attendees,
    attachments: diary.attachments,
  }));
}

/** @gqlQueryField */
export async function siteDiary(id: string): Promise<SiteDiary | null> {
  await connectDB();

  const diary = await SiteDiaryModel.findOne({ id }).lean();

  if (!diary) {
    return null;
  }

  return {
    id: diary.id,
    date: diary.date,
    title: diary.title,
    createdBy: diary.createdBy,
    content: diary.content,
    weather: diary.weather,
    attendees: diary.attendees,
    attachments: diary.attachments,
  };
}
