'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { VCardFormData } from '@/types/vcard';
import DEFAULT_AVATAR from '@/constants/default-avatar';

type Props = {
  formData: VCardFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidityChange?: (isValid: boolean) => void;
};

const isEmpty = (v: string) => !v.trim();
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
      parsed.hostname.includes('.') &&
      parsed.hostname.split('.').pop()!.length >= 2;
  } catch {
    return false;
  }
};

export default function ContactForm({
  formData,
  onChange,
  onPhotoChange,
  onValidityChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const isValid =
    !isEmpty(formData.firstName) &&
    !isEmpty(formData.lastName) &&
    isValidEmail(formData.email) &&
    !isEmpty(formData.notes) &&
    isValidUrl(formData.website || '');

  useEffect(() => onValidityChange?.(isValid), [formData, isValid]);

  const websiteNoProto = formData.website?.replace(/^https?:\/\//, '') || '';
  const avatar = formData.photo?.trim() || DEFAULT_AVATAR;

  return (
    <div className="space-y-6">
      {(['firstName', 'lastName'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field === 'firstName' ? 'First name' : 'Last name'}
          </label>
          <input
            name={field}
            type="text"
            value={formData[field]}
            onChange={onChange}
            onBlur={() => markTouched(field)}
            className={`block w-full rounded-md border px-3 py-2 shadow-sm ${
              touched[field] && isEmpty(formData[field])
                ? 'border-red-500'
                : 'border-gray-300'
            } focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none`}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          onBlur={() => markTouched('email')}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm ${
            touched.email && !isValidEmail(formData.email)
              ? 'border-red-500'
              : 'border-gray-300'
          } focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none`}
        />
        {touched.email && !isValidEmail(formData.email) && (
          <p className="mt-1 text-sm text-red-600">Enter a valid email address.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            <Image src={avatar} alt="avatar" width={48} height={48} className="object-cover w-full h-full" />
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {formData.photo ? 'Change' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <div className="flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md bg-gray-100 text-gray-500 text-sm">
            http://
          </span>
          <input
            name="website"
            type="text"
            value={websiteNoProto}
            placeholder="www.example.com"
            onChange={(e) => {
              const full = `http://${e.target.value.replace(/^https?:\/\//, '')}`;
              onChange({
                ...e,
                target: { ...e.target, name: 'website', value: full },
              });
            }}
            onBlur={() => markTouched('website')}
            className={`block w-full rounded-r-md border px-3 py-2 ${
              touched.website && !isValidUrl(formData.website || '')
                ? 'border-red-500'
                : 'border-gray-300'
            } focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none`}
          />
        </div>
        {touched.website && !isValidUrl(formData.website || '') && (
          <p className="mt-1 text-sm text-red-600">Enter a valid URL (e.g., https://site.com).</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          rows={3}
          placeholder="I'm a backend developer…"
          value={formData.notes}
          onChange={onChange}
          onBlur={() => markTouched('notes')}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm resize-none ${
            touched.notes && isEmpty(formData.notes)
              ? 'border-red-500'
              : 'border-gray-300'
          } focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none`}
        />
        <p className="mt-1 text-sm text-gray-500">Brief description for your profile</p>
      </div>
    </div>
  );
}
