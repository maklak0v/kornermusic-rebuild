export interface VideoItem {
  id: string;
  title: string;
  beta: string;
  category: 'DJ SET' | 'ORIGINAL MUSIC' | 'FILM' | 'PROCESS' | 'BEHIND THE SCENES';
  date: string;
  duration: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  featured: boolean;
}

export const videos: VideoItem[] = [
  {
    id: 'beta-004',
    title: 'マキシム',
    beta: 'beta_0.03',
    category: 'ORIGINAL MUSIC',
    date: '2026.01.18',
    duration: '03:42',
    description: 'The official visualizer for マキシム. Shot on a single hand-held camera through the streets of downtown LA after midnight.',
    thumbnail: '/images/image.png',
    videoUrl: 'https://www.youtube.com/embed/asywxoK5l3k?rel=0&modestbranding=1',
    featured: true,
  },
  {
    id: 'beta-003',
    title: 'マキシム',
    beta: 'beta_0.03',
    category: 'PROCESS',
    date: '2025.12.05',
    duration: '06:18',
    description: 'dedicated to my best friend, who is more than 5,000 miles away from me. 18 years of friendship. different places, different lives, but the same connection.',
    thumbnail: '/images/image.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    featured: false,
  },
  {
    id: 'beta-002',
    title: 'Powder',
    beta: 'beta_0.02 — Powder',
    category: 'FILM',
    date: '2025.10.21',
    duration: '04:51',
    description: 'A short film. A figure walks away from the city until the sound fades. Original score by KORNER.',
    thumbnail: 'https://images.pexels.com/photos/35291222/pexels-photo-35291222.jpeg?auto=compress&cs=tinysrgb&w=1600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    featured: false,
  },
  {
    id: 'beta-001',
    title: 'beta_0.01',
    beta: 'beta_0.01',
    category: 'DJ SET',
    date: '2025.09.03',
    duration: '58:22',
    description: 'A full closing set from an unknown warehouse. The last record plays to an empty room.',
    thumbnail: 'https://images.pexels.com/photos/5175595/pexels-photo-5175595.jpeg?auto=compress&cs=tinysrgb&w=1600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    featured: false,
  },
  {
    id: 'bts-001',
    title: 'behind IKON',
    beta: 'BTS',
    category: 'BEHIND THE SCENES',
    date: '2026.01.20',
    duration: '02:34',
    description: 'Footage from the night we shot the IKON visualizer. Cold hands, warm lights, one take.',
    thumbnail: 'https://images.pexels.com/photos/18974663/pexels-photo-18974663.jpeg?auto=compress&cs=tinysrgb&w=1600',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    featured: false,
  },
];
