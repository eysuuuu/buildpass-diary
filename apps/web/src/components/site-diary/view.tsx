'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SiteDiary } from '@/data/site-diary';
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  Thermometer,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface SiteDiaryViewProps {
  diary: SiteDiary;
}

export function SiteDiaryView({ diary }: SiteDiaryViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny')) return '☀️';
    if (desc.includes('cloudy')) return '☁️';
    if (desc.includes('rainy')) return '🌧️';
    if (desc.includes('windy')) return '💨';
    return '🌤️';
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/site-diary">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-foreground text-3xl font-bold">{diary.title}</h1>
        </div>
        <Link href={`/site-diary/${diary.id}/edit`}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Diary Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Entry Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Date
                </label>
                <p className="text-lg">{formatDate(diary.date)}</p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Content
                </label>
                <p className="text-lg leading-relaxed">
                  {diary.content || 'No content provided.'}
                </p>
              </div>

              {diary.weather && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Weather
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-2xl">
                      {getWeatherIcon(diary.weather.description)}
                    </span>
                    <div>
                      <p className="text-lg font-medium">
                        {diary.weather.description.charAt(0).toUpperCase() +
                          diary.weather.description.slice(1)}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {diary.weather.temperature}°C
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          {diary.attachments && diary.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images ({diary.attachments?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <CarouselContent>
                    {diary.attachments?.map((attachment, index) => (
                      <CarouselItem key={index}>
                        <div
                          className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(attachment)}
                        >
                          <Image
                            src={attachment}
                            alt={`Site diary image ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                          <div className="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                            {index + 1} / {diary.attachments?.length}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {(diary.attachments?.length ?? 0) > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Entry Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Created by
                </label>
                <p className="font-medium">{diary.createdBy}</p>
              </div>

              {diary.attendees && diary.attendees.length > 0 && (
                <div>
                  <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Attendees ({diary.attendees.length})
                  </label>
                  <div className="mt-2 space-y-1">
                    {diary.attendees.map((attendee, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {diary.attachments && diary.attachments.length > 0 && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Attachments
                  </label>
                  <p className="text-muted-foreground text-sm">
                    {diary.attachments.length} image
                    {diary.attachments.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            <Image
              src={selectedImage}
              alt="Selected image"
              width={800}
              height={600}
              className="max-h-[90vh] rounded-lg object-contain"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
