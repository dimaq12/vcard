'use client';

import Image from 'next/image';
import type { VCardFormData } from '@/types/vcard';

import DEFAULT_AVATAR from '@/constants/default-avatar';


type Props = {
  formData: VCardFormData;
};

export default function PreviewCard({ formData }: Props) {
  const avatarSrc = formData.photo?.trim() || DEFAULT_AVATAR;
  const displayName =
    formData.firstName || formData.lastName
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : 'Your Full Name';

  const details = [
    {
      label: 'Website:',
      value: formData.website?.trim() ? (
        <a
          href={formData.website}
          className="text-indigo-600 underline break-all"
          target="_blank"
          rel="noreferrer"
        >
          {formData.website}
        </a>
      ) : (
        <span className="text-gray-400 italic">https://your-site.com</span>
      ),
    },
    {
      label: 'Email:',
      value: formData.email?.trim() ? (
        formData.email
      ) : (
        <span className="text-gray-400 italic">you@example.com</span>
      ),
    },
    {
      label: 'Notes:',
      value: formData.notes?.trim() ? (
        formData.notes
      ) : (
        <span className="text-gray-400 italic">Short description about yourself</span>
      ),
    },
  ];

  return (
    <div className="w-full rounded-xl border-2 border-dashed border-gray-300 pt-6 space-y-4 bg-white">
      <div className="flex justify-center">
        <div className="w-[121px] h-[121px] rounded-3xl overflow-hidden flex items-center justify-center">
          <Image
            src={avatarSrc}
            alt="avatar"
            width={121}
            height={121}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <h2 className="text-center text-lg font-semibold text-gray-800">
        {displayName}
      </h2>

      <div className="text-sm text-gray-700 rounded-md overflow-hidden">
        {details.map((item, index) => (
          <div key={index} className="flex px-4 py-2 even:bg-gray-50">
            <div className="w-20 font-medium text-gray-600 shrink-0">{item.label}</div>
            <div className="flex-1">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
