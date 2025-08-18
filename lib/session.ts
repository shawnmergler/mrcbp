import { cookies } from 'next/headers';

export function getUid(): string | null {
  return cookies().get('uid')?.value ?? null;
}
