"use client";

import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";
import PreviewCard from "@/components/PreviewCard";
import FormActions from "@/components/FormActions";
import { api } from "@/lib/httpClient";
import { resizeImage } from "@/lib/resizeImage";
import type { VCardFormData } from "@/types/vcard";

const empty: VCardFormData = {
  firstName: "",
  lastName: "",
  email: "",
  website: "",
  notes: "",
  photo: "",
};

type VCardResponse = VCardFormData & { publicId: string };

export default function HomePage() {
  const [form, setForm] = useState(empty);
  const [publicId, setPublicId] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);  const canSave = isValid && isDirty;
  const canShare = !isDirty && !!publicId;

  useEffect(() => {
    (async () => {
      try {
        const { publicId: id, ...data } = await api<VCardResponse>("/vcards");
        setForm(data);
        setPublicId(id);
      } finally {
        setDirty(false);
        setLoading(false);
      }
    })();
  }, []);

  const update = (next: VCardFormData) => {
    setForm(next);
    setDirty(true);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    update({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const photo = await resizeImage(file);
      update({ ...form, photo });
    } catch {
      console.error("resize failed");
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    try {
      const method = publicId ? "PUT" : "POST";
      const { publicId: id } = await api<VCardResponse, VCardFormData>(
        "/vcards",
        { method, body: form }
      );
      setPublicId(id);
      setDirty(false);
    } catch {
      console.error("save failed");
    }
  };

  const handleShare = () => {
    if (!canShare) return;
    const link = `${window.location.origin}/share/${publicId}`;
    navigator.clipboard.writeText(link);
  };

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start">
        <div className="w-full md:w-7/12">
          <h1 className="text-3xl font-semibold mb-8">Create your own contact card</h1>
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <ContactForm
              formData={form}
              onChange={handleInput}
              onPhotoChange={handlePhoto}
              onValidityChange={setIsValid}
            />
          </div>
        </div>

        <div className="w-full md:w-1/3 md:ml-auto mt-12 md:mt-0 space-y-8">
          <div className="flex justify-end gap-4">
            <FormActions
              onSave={handleSave}
              onShare={handleShare}
              isDirty={isDirty}
              canShare={canShare}
              isValid={isValid}
            />
          </div>
          <PreviewCard formData={form} />
        </div>
      </div>
    </div>
  );
}
