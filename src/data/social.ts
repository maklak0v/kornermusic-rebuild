export type SocialCategory = 'music' | 'social';

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
  category: SocialCategory;
}

export const socialLinks: SocialLink[] = [
  { label: 'Spotify', url: 'https://open.spotify.com/artist/2HRJqOYmrXQllT9vGrSE63', icon: 'Spotify', category: 'music' },
  { label: 'SoundCloud', url: 'https://soundcloud.com/kornermusic', icon: 'SoundCloud', category: 'music' },
  { label: 'Apple Music', url: 'https://music.apple.com/us/artist/korner/6794006512', icon: 'Apple Music', category: 'music' },
  { label: 'YouTube', url: 'https://www.youtube.com/@_korner', icon: 'YouTube', category: 'music' },
  { label: 'YouTube Music', url: 'https://www.youtube.com/channel/UCwkOjXNo1d6_7pseErCDQjg', icon: 'YouTube Music', category: 'music' },
  { label: 'Deezer', url: 'https://www.deezer.com/us/artist/405505772?app_id=140685', icon: 'Deezer', category: 'music' },
  { label: 'Amazon Music', url: 'https://music.amazon.com/artists/B0H9ZZPHNC/korner', icon: 'Amazon Music', category: 'music' },
  { label: 'Pandora', url: 'https://www.pandora.com/artist/korner/AR24nzzpfk9jP5P', icon: 'Pandora', category: 'music' },
  { label: 'Instagram', url: 'https://www.instagram.com/_korner.music/', icon: 'Instagram', category: 'social' },
  { label: 'Threads', url: 'https://www.threads.com/@_korner.music?hl=en', icon: 'Threads', category: 'social' },
  { label: 'Facebook', url: 'https://www.facebook.com/kornermusic', icon: 'Facebook', category: 'social' },
  { label: 'X', url: 'https://x.com/_kornermusic', icon: 'X', category: 'social' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@_korner.music', icon: 'TikTok', category: 'social' },
];

export const musicLinks = socialLinks.filter((s) => s.category === 'music');
export const socialMediaLinks = socialLinks.filter((s) => s.category === 'social');
export const headerSocial = socialLinks.filter((s) =>
  ['Instagram', 'TikTok', 'YouTube', 'Spotify'].includes(s.label),
);
