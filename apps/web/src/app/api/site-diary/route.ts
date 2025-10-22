import connectDB from '@/lib/mongodb';
import SiteDiaryModel from '@/models/SiteDiary';
import { NextRequest, NextResponse } from 'next/server';
import { SiteDiary } from '../../../data/site-diary';

export async function GET() {
  try {
    await connectDB();

    const diaries = await SiteDiaryModel.find({})
      .sort({ date: -1 })
      .select('id date title createdBy')
      .lean();

    return NextResponse.json(diaries, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching site diaries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST handler: Create a new site diary
export async function POST(request: NextRequest) {
  try {
    const siteDiary = (await request.json()) as SiteDiary;

    // Check that id, date, createdBy and title are present
    if (
      !siteDiary.id ||
      !siteDiary.date ||
      !siteDiary.createdBy ||
      !siteDiary.title
    ) {
      throw new Error('id, date, createdBy and title are required');
    }

    await connectDB();

    const newDiary = await SiteDiaryModel.create(siteDiary);

    return NextResponse.json(
      {
        message: 'Site diary created successfully',
        siteDiary: {
          id: newDiary.id,
          date: newDiary.date,
          title: newDiary.title,
          createdBy: newDiary.createdBy,
          content: newDiary.content,
          weather: newDiary.weather,
          attendees: newDiary.attendees,
          attachments: newDiary.attachments,
        },
      },
      { status: 201 },
    );
  } catch (e: unknown) {
    let errorMessage = 'Unknown error';

    if (e instanceof Error) {
      errorMessage = e.message;
    }

    console.error('Error creating site diary:', errorMessage);

    return NextResponse.json(
      { error: 'Invalid request format', errorMessage },
      { status: 400 },
    );
  }
}
