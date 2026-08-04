export type VideoCategory =
  | 'DJ SET'
  | 'ORIGINAL MUSIC'
  | 'FILM'
  | 'PROCESS'
  | 'BEHIND THE SCENES';

export interface VideoItem {
  id: string;
  title: string;
  beta: string;
  category: VideoCategory;
  date: string;
  duration: string;
  description: string;
  quote: string;
  thumbnail: string;
  featuredImage: string;
  youtubeUrl: string;
}

export const videos: VideoItem[] = [
  {
    id: 'beta-004',
    title: 'マキシム',
    beta: 'beta_0.04',
    category: 'ORIGINAL MUSIC',
    date: '2026.01.18',
    duration: '03:42',
    description:
      'The official visualizer for マキシム. Shot on a single hand-held camera through the streets of downtown LA after midnight.',
    quote: 'a city is just a room with no ceiling',
    thumbnail: '/images/image.png',
    featuredImage: '/images/image.png',
    youtubeUrl: 'https://www.youtube.com/watch?v=asywxoK5l3k',
  },
  {
    id: 'beta-002',
    title: 'Powder',
    beta: 'beta_0.02',
    category: 'FILM',
    date: '2025.10.21',
    duration: '45:42',
    description:
      'A short film. A figure walks away from the city until the sound fades. Original score by KORNER.',
    quote: 'walk until the sound fades',
    thumbnail: '/images/image.png',
    featuredImage: '/images/image.png',
    youtubeUrl: 'https://www.youtube.com/watch?v=dYEKZzdu5Xw',
  },
  {
    id: 'beta-003',
    title: 'マキシム',
    beta: 'beta_0.03',
    category: 'PROCESS',
    date: '2025.12.05',
    duration: '59:22',
    description:
      'dedicated to my best friend, who is more than 5,000 miles away from me. 18 years of friendship. different places, different lives, but the same connection.',
    quote: 'different places, same connection',
    thumbnail: '/images/image.png',
    featuredImage: '/images/image.png',
    youtubeUrl: 'https://www.youtube.com/watch?v=asywxoK5l3k',
  },
];
