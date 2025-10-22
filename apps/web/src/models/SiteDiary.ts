import mongoose, { Model, Schema } from 'mongoose';

export interface ISiteDiary {
  id: string;
  date: string;
  title: string;
  createdBy: string;
  content?: string;
  weather?: {
    temperature: number;
    description: string;
  };
  attendees?: string[];
  attachments?: string[];
}

const WeatherSchema = new Schema(
  {
    temperature: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const SiteDiarySchema = new Schema<ISiteDiary>(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    createdBy: { type: String, required: true },
    content: { type: String },
    weather: { type: WeatherSchema },
    attendees: [{ type: String }],
    attachments: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const SiteDiaryModel: Model<ISiteDiary> =
  mongoose.models.SiteDiary ||
  mongoose.model<ISiteDiary>('SiteDiary', SiteDiarySchema);

export default SiteDiaryModel;
