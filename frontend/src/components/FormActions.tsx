'use client';

import { Check, Link } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

type Props = {
  onSave: () => void;
  onShare: () => void;
  isDirty: boolean;
  canShare: boolean;
  isValid: boolean;
};

export default function FormActions({ onSave, onShare, isDirty, canShare, isValid }: Props) {
  const isSaveDisabled = !isValid || !isDirty;
  const isShareDisabled = !canShare;
  const [copied, setCopied] = useState(false);

  const base = 'inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition';

  const shareClass = clsx(
    base,
    'border border-gray-300 text-gray-700 hover:bg-gray-100',
    { 'opacity-50 cursor-not-allowed': isShareDisabled }
  );

  const saveClass = clsx(
    base,
    {
      'bg-gray-300 text-gray-500 cursor-not-allowed': isSaveDisabled,
      'bg-[#4F46E5] text-white hover:bg-[#4338CA]': !isSaveDisabled,
    }
  );

  const handleShareClick = () => {
    if (isShareDisabled) return;
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center justify-end gap-3">
      {isDirty && (
        <span className="ml-2 text-sm text-red-500 font-medium">Unsaved</span>
      )}

      <div className="relative">
        <button onClick={handleShareClick} disabled={isShareDisabled} className={shareClass}>
          <Link size={16} />
          Share
        </button>
        {copied && (
          <div className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded-md shadow">
            Link copied!
          </div>
        )}
      </div>

      <button onClick={onSave} disabled={isSaveDisabled} className={saveClass}>
        <Check size={16} />
        Save
      </button>
    </div>
  );
}
