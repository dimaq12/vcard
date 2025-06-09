import { VCard } from '../vcard/vcard.entity';


export function generateVCardText(card: VCard, user: any): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${user.lastName};${user.firstName}`,
    `FN:${user.firstName} ${user.lastName}`,
    `EMAIL:${user.email}`,
    `URL:${user.website}`,
    `NOTE:${user.notes}`,
  ];

  if (user.photo?.startsWith('data:image/')) {
    const [meta, base64] = user.photo.split(',');
    const mimeMatch = meta.match(/data:(image\/[^;]+);base64/);
    if (mimeMatch) {
      const mime = mimeMatch[1];
      lines.push(`PHOTO;ENCODING=b;TYPE=${mime.split('/')[1].toUpperCase()}:${base64}`);
    }
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}
