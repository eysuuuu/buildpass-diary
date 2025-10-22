import { siteDiaries } from '@/data/site-diary';
import connectDB from '@/lib/mongodb';
import SiteDiaryModel from '@/models/SiteDiary';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await SiteDiaryModel.deleteMany({});
    console.log('Cleared existing site diaries');

    // Insert seed data
    await SiteDiaryModel.insertMany(siteDiaries);
    console.log(`Seeded ${siteDiaries.length} site diaries`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
