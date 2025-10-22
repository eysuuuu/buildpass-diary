'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiteDiary } from '@/data/site-diary';
import { CREATE_SITE_DIARY, SITE_DIARIES } from '@/graphql/queries';
import { useUploadThing } from '@/lib/uploadthing';
import { useMutation } from '@apollo/client/react';
import { ArrowLeft, Loader2, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Weather options
const WEATHER_OPTIONS = [
  { value: 'sunny', label: '☀️ Sunny' },
  { value: 'partly cloudy', label: '⛅ Partly Cloudy' },
  { value: 'cloudy', label: '☁️ Cloudy' },
  { value: 'rainy', label: '🌧️ Rainy' },
  { value: 'stormy', label: '⛈️ Stormy' },
  { value: 'windy', label: '💨 Windy' },
  { value: 'snowy', label: '❄️ Snowy' },
  { value: 'foggy', label: '🌫️ Foggy' },
];

// Suggested attendees
const SUGGESTED_ATTENDEES = [
  { value: 'john-doe', label: 'John Doe' },
  { value: 'jane-smith', label: 'Jane Smith' },
  { value: 'robert-brown', label: 'Robert Brown' },
  { value: 'mary-johnson', label: 'Mary Johnson' },
  { value: 'mike-anderson', label: 'Mike Anderson' },
  { value: 'sarah-wilson', label: 'Sarah Wilson' },
  { value: 'david-martinez', label: 'David Martinez' },
  { value: 'emily-davis', label: 'Emily Davis' },
];

interface SiteDiaryFormProps {
  diary?: SiteDiary;
  isEditing?: boolean;
}

export function SiteDiaryForm({
  diary,
  isEditing = false,
}: SiteDiaryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: diary?.title || '',
    content: diary?.content || '',
    date: diary?.date || new Date().toISOString().split('T')[0],
    createdBy: diary?.createdBy || '',
    weatherDescription: diary?.weather?.description || '',
    temperature: diary?.weather?.temperature?.toString() || '',
  });

  const [selectedAttendees, setSelectedAttendees] = useState<string[]>(
    diary?.attendees || [],
  );
  const [images, setImages] = useState<string[]>(diary?.attachments || []);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [createSiteDiary, { loading }] = useMutation(CREATE_SITE_DIARY, {
    refetchQueries: [{ query: SITE_DIARIES }],
  });

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: (files: Array<{ url: string }>) => {
      const urls = files.map((file) => file.url);
      setImages((prev) => [...prev, ...urls]);
      setUploadingImages(false);
    },
    onUploadError: (error: Error) => {
      setError(`Upload failed: ${error.message}`);
      setUploadingImages(false);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAttendee = (attendeeName: string) => {
    if (attendeeName && !selectedAttendees.includes(attendeeName)) {
      setSelectedAttendees((prev) => [...prev, attendeeName]);
    }
  };

  const handleRemoveAttendee = (attendee: string) => {
    setSelectedAttendees((prev) => prev.filter((a) => a !== attendee));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      await startUpload(Array.from(files));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createSiteDiary({
        variables: {
          input: {
            id: diary?.id || `diary-${Date.now()}`,
            date: formData.date,
            title: formData.title,
            createdBy: formData.createdBy,
            content: formData.content || undefined,
            weather:
              formData.weatherDescription && formData.temperature
                ? {
                    temperature: Number(formData.temperature),
                    description: formData.weatherDescription,
                  }
                : undefined,
            attendees:
              selectedAttendees.length > 0 ? selectedAttendees : undefined,
            attachments: images.length > 0 ? images : undefined,
          },
        },
      });

      router.push('/site-diary');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create site diary',
      );
      console.error('Mutation error:', err);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 p-6 shadow-sm dark:from-cyan-950/20 dark:to-blue-950/20">
        <Link href={isEditing ? `/site-diary/${diary?.id}` : '/site-diary'}>
          <Button
            variant="outline"
            size="sm"
            className="mb-4 flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEditing ? 'Back to Entry' : 'Back to List'}
          </Button>
        </Link>
        <h1 className="text-foreground mb-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          {isEditing ? '✏️ Edit Site Diary' : '📝 New Site Diary'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {isEditing
            ? 'Update the details of your site diary entry'
            : "Document today's construction site activities and progress"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50">
                <CardTitle className="flex items-center gap-2">
                  📋 Entry Details
                  <span className="text-muted-foreground text-xs font-normal">
                    * Required fields
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-1">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      placeholder="e.g., Foundation Work - Day 1"
                      required
                      className={
                        !formData.title
                          ? 'border-orange-200 dark:border-orange-900'
                          : ''
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-1">
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange('date', e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="createdBy"
                    className="flex items-center gap-1"
                  >
                    Created By <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="createdBy"
                    value={formData.createdBy}
                    onChange={(e) =>
                      handleInputChange('createdBy', e.target.value)
                    }
                    placeholder="Your full name"
                    required
                    className={
                      !formData.createdBy
                        ? 'border-orange-200 dark:border-orange-900'
                        : ''
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="flex items-center gap-2">
                    Content
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange('content', e.target.value)
                    }
                    placeholder="Describe the day's activities, progress, challenges, and any important notes..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    💡 Tip: Include details about work completed and any issues
                    encountered
                  </p>
                </div>

                <div className="rounded-lg border bg-gradient-to-r from-blue-50/50 to-transparent p-4 dark:from-blue-950/20">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    🌤️ Weather & Conditions
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Weather</Label>
                      <Combobox
                        options={WEATHER_OPTIONS}
                        value={formData.weatherDescription}
                        onValueChange={(value) =>
                          handleInputChange('weatherDescription', value)
                        }
                        placeholder="Select weather..."
                        searchPlaceholder="Search weather..."
                        emptyText="No weather found."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        value={formData.temperature}
                        onChange={(e) =>
                          handleInputChange('temperature', e.target.value)
                        }
                        placeholder="e.g., 22"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-gradient-to-r from-purple-50/50 to-transparent p-4 dark:from-purple-950/20">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    👥 Attendees
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </h3>
                  <div className="space-y-2">
                    <Combobox
                      options={SUGGESTED_ATTENDEES}
                      value=""
                      onValueChange={(value) => {
                        const attendee = SUGGESTED_ATTENDEES.find(
                          (a) => a.value === value,
                        );
                        if (attendee) {
                          handleAddAttendee(attendee.label);
                        }
                      }}
                      placeholder="Add attendees..."
                      searchPlaceholder="Search people..."
                      emptyText="No person found."
                    />
                    {selectedAttendees.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedAttendees.map((attendee) => (
                          <Badge
                            key={attendee}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1.5"
                          >
                            👤 {attendee}
                            <button
                              type="button"
                              onClick={() => handleRemoveAttendee(attendee)}
                              className="hover:bg-secondary-foreground/20 ml-1 rounded-full p-0.5 transition-colors"
                              title="Remove attendee"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-2 text-xs italic">
                        No attendees selected yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6 text-center">
                  {uploadingImages || isUploading ? (
                    <>
                      <Loader2 className="text-muted-foreground mx-auto mb-2 h-8 w-8 animate-spin" />
                      <p className="text-sm font-medium">Uploading images...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80 text-sm font-medium">
                          Click to upload images
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImages || isUploading}
                        />
                      </Label>
                      <p className="text-muted-foreground mt-1 text-xs">
                        PNG, JPG up to 4MB each (max 10 images)
                      </p>
                    </>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading ||
                    !formData.title ||
                    !formData.date ||
                    !formData.createdBy
                  }
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading
                    ? 'Saving...'
                    : isEditing
                      ? 'Update Entry'
                      : 'Create Entry'}
                </Button>

                <Link
                  href={isEditing ? `/site-diary/${diary?.id}` : '/site-diary'}
                  className="block"
                >
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                  <p>
                    Include specific details about work progress and challenges
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                  <p>Note any safety incidents or equipment issues</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
                  <p>Take photos to document progress and conditions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
