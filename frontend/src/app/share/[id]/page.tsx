'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api, download } from '@/lib/httpClient';
import type { VCardFormData } from '@/types/vcard';

export default function ShareDownloadPage() {
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const { firstName, lastName } = await api<VCardFormData>(`/vcards`);

        await download(`/vcards/${id}/download`, {
          fallbackName: `${firstName}_${lastName}.vcf`,
        });
      } catch (err) {
        console.error('Download failed:', err);
        alert('Failed to download vCard');
      }
    })();
  }, [id]);

  return (
    <div className="p-6 text-center text-gray-600">
      Preparing your download...
    </div>
  );
}
