export function getImageUrl(path: string | undefined | null) {
  if (!path) return '/superhero.jpg';

  if (path.startsWith('http')) return path;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
    'http://localhost:5000';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}
