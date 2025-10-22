'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar,
  Camera,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  User,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Weather {
  temperature: number;
  description: string;
}

interface SiteDiary {
  id: string;
  date: string;
  title: string;
  content?: string | null;
  createdBy: string;
  weather?: Weather | null;
  attendees?: string[] | null;
  attachments?: string[] | null;
}

interface DiaryItemProps {
  diary: SiteDiary;
  formatDate: (dateString: string) => string;
}

// Weather icon mapping with colors
const getWeatherIconAndColor = (
  description: string,
): { icon: LucideIcon; color: string; bgColor: string } => {
  const desc = description.toLowerCase();

  if (desc.includes('sunny') || desc.includes('clear')) {
    return {
      icon: Sun,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    };
  }
  if (desc.includes('rain') || desc.includes('shower')) {
    return {
      icon: CloudRain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    };
  }
  if (desc.includes('drizzle')) {
    return {
      icon: CloudDrizzle,
      color: 'text-sky-500',
      bgColor: 'bg-sky-50 dark:bg-sky-950',
    };
  }
  if (desc.includes('snow')) {
    return {
      icon: CloudSnow,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
    };
  }
  if (desc.includes('partly cloudy') || desc.includes('partly-cloudy')) {
    return {
      icon: CloudSun,
      color: 'text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    };
  }
  if (desc.includes('cloudy') || desc.includes('overcast')) {
    return {
      icon: Cloud,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-900',
    };
  }
  if (desc.includes('wind')) {
    return {
      icon: Wind,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
    };
  }

  // Default
  return {
    icon: Cloud,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900',
  };
};

export function DiaryItem({ diary, formatDate }: DiaryItemProps) {
  const weatherInfo = diary.weather
    ? getWeatherIconAndColor(diary.weather.description)
    : null;
  const WeatherIcon = weatherInfo?.icon;

  return (
    <Card
      key={diary.id}
      className="group relative overflow-hidden border-l-4 border-l-cyan-500 transition-all hover:scale-[1.005] hover:border-l-cyan-600 hover:shadow-xl sm:hover:scale-[1.01]"
    >
      {/* Hover indicator */}
      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />

      <Link href={`/site-diary/${diary.id}`}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <div className="flex-1">
              <CardTitle className="group-hover:text-primary mb-2 flex items-start gap-2 text-lg transition-colors sm:text-xl lg:text-2xl">
                <span className="flex-1">{diary.title}</span>
                <span className="text-muted-foreground group-hover:text-primary text-xs opacity-0 transition-all group-hover:opacity-100">
                  View →
                </span>
              </CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {formatDate(diary.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {diary.createdBy}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Link>
      <Link href={`/site-diary/${diary.id}`}>
        <CardContent className="pt-0">
          {diary.content && (
            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed sm:text-base lg:line-clamp-3 lg:text-base">
              {diary.content}
            </p>
          )}
        </CardContent>
      </Link>
      <CardContent className="pt-0">
        <div className="flex flex-row items-center justify-end gap-2">
          {diary.weather && WeatherIcon && (
            <div
              className={`flex w-fit items-center gap-1.5 rounded-lg px-2 py-1.5 shadow-sm sm:gap-2 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 ${weatherInfo.bgColor}`}
              title={`Weather: ${diary.weather.description}, ${diary.weather.temperature}°C`}
            >
              <WeatherIcon
                className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${weatherInfo.color}`}
              />
              <div className="flex flex-col">
                <span
                  className={`text-sm font-semibold sm:text-base lg:text-lg ${weatherInfo.color}`}
                >
                  {diary.weather.temperature}°C
                </span>
                <span className="text-muted-foreground text-xs capitalize">
                  {diary.weather.description}
                </span>
              </div>
            </div>
          )}
          {diary.attendees && diary.attendees.length > 0 && (
            // Popover to display the attendees
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="flex w-fit items-center gap-1.5 rounded-lg bg-purple-50 px-2 py-1.5 shadow-sm transition-all hover:scale-105 hover:cursor-pointer hover:bg-purple-100 hover:shadow-md sm:gap-2 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 dark:bg-purple-950 dark:hover:bg-purple-900"
                  title="Click to see attendees"
                >
                  <Users className="h-4 w-4 text-purple-500 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-purple-500 sm:text-base lg:text-lg">
                      {diary.attendees.length}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      attendee
                      {diary.attendees.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-72 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <h4 className="font-semibold">
                      Attendees ({diary.attendees.length})
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    People present at this site visit
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {diary.attendees.map((attendee) => (
                      <Badge
                        key={attendee}
                        variant="secondary"
                        className="text-xs"
                      >
                        👤 {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {diary.attachments && diary.attachments.length > 0 && (
            // Popover to display the photos
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className="flex w-fit items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 shadow-sm transition-all hover:scale-105 hover:cursor-pointer hover:bg-emerald-100 hover:shadow-md sm:gap-2 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 dark:bg-emerald-950 dark:hover:bg-emerald-900"
                  title="Click to preview photos"
                >
                  <Camera className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-emerald-500 sm:text-base lg:text-lg">
                      {diary.attachments.length}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      photo
                      {diary.attachments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,400px)] shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Camera className="h-4 w-4 text-emerald-500" />
                    <h4 className="font-semibold">
                      Photos ({diary.attachments.length})
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    📸 Swipe or use arrows to browse images
                  </p>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {diary.attachments.map((image, idx) => (
                        <CarouselItem key={idx}>
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={image}
                              alt={`Photo ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute right-2 bottom-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                              {idx + 1} / {diary.attachments?.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {diary.attachments.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
