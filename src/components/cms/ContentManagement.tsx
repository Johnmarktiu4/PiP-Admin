"use client";
import React, { useEffect, useState } from "react";
import { FetchAPIData, requestFormData } from "@/lib/api";

// ─── Section Types ────────────────────────────────────────────────────────────

interface IntroContent {
  fld_id?: number;
  fld_Content: string;
  fld_Type: string;   // "overline" | "heading" | "body"
  fld_Sort: number;
  fld_Status: string;
}

interface IntroImage {
  fld_id?: number;
  fld_Image: string;  // base64 from API
  fld_Alt: string;
  fld_Status: string;
  _newFile?: File;    // set when user picks a new file to upload
}

interface IntroSocial {
  fld_Id?: number;
  fld_SocialMedia: string;
  fld_URL: string;
  fld_Status: string;
}

interface AboutContent {
  fld_id?: number;
  fld_Content: string;
  fld_Sort: number;
  fld_Status: string;
}

interface AboutMissionVision {
  fld_id?: number;
  fld_Content: string;
  fld_Type: string;   // "mission" | "vision"
  fld_Sort: number;
  fld_Status: string;
}

interface AboutImage {
  fld_id?: number;
  fld_Image: string;  // base64 from API
  fld_Alt: string;
  fld_Status: string;
  _newFile?: File;
}

interface GalleryItem {
  id: number;
  src: string;       // existing URL from DB / public folder
  preview: string;   // local object URL after a new file is picked
  file: File | null; // the actual File to upload
  alt: string;
  active: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  message: string;
}

interface ContactContent {
  address: string;
  email: string;
  phone: string;
  weekdayHours: string;
  weekendHours: string;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const defaultCasketGallery: GalleryItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: "images/gallery/gallery-01.jpg",
  preview: "",
  file: null,
  alt: `Casket ${i + 1}`,
  active: true,
}));

const defaultGallery: GalleryItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  src: "images/gallery/gallery-01.jpg",
  preview: "",
  file: null,
  alt: `Gallery image ${i + 1}`,
  active: true,
}));

const defaultTestimonials: Testimonial[] = [
  { id: 1, name: "John Rockefeller", location: "Cleveland, Ohio", avatar: "images/avatars/user-02.jpg", message: "Molestiae incidunt consequatur quis ipsa autem nam sit enim magni. Voluptas tempore rem." },
  { id: 2, name: "Andrew Carnegie", location: "Pittsburgh, Pennsylvania", avatar: "images/avatars/user-03.jpg", message: "Excepturi nam cupiditate culpa doloremque deleniti repellat. Veniam quos repellat voluptas animi adipisci." },
  { id: 3, name: "John Morgan", location: "New York City", avatar: "images/avatars/user-01.jpg", message: "Repellat dignissimos libero. Qui sed at corrupti expedita voluptas odit. Nihil ea quia nesciunt." },
  { id: 4, name: "Henry Ford", location: "Dearborn, Michigan", avatar: "images/avatars/user-06.jpg", message: "Nunc interdum lacus sit amet orci. Vestibulum dapibus nunc ac augue. Fusce vel dui." },
];

const defaultContact: ContactContent = {
  address: "867 Dra. Salamanca St. San Roque, Cavite City, Cavite, Philippines, 4100",
  email: "contact@test.com",
  phone: "(213) 555-123-3456",
  weekdayHours: "10:00am - 9:00pm",
  weekendHours: "9:00am - 10:00pm",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

type SectionTab = "intro" | "about" | "casket" | "gallery" | "testimonials" | "contact";

const TABS: { key: SectionTab; label: string }[] = [
  { key: "intro", label: "Home" },
  { key: "about", label: "About" },
  { key: "casket", label: "Casket" },
  { key: "gallery", label: "Gallery" },
  { key: "testimonials", label: "Testimonials" },
  { key: "contact", label: "Contact" },
];

// ─── Intro Section ────────────────────────────────────────────────────────────

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [preview, setPreview] = useState<string>(value);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(url);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>
      {preview && (
        <img
          src={preview}
          alt={label}
          className="mb-2 h-36 w-full rounded-lg object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          placeholder="Image path or URL"
          onChange={(e) => { setPreview(e.target.value); onChange(e.target.value); }}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
    </div>
  );
}

function IntroSection() {
  const [contents, setContents]   = useState<IntroContent[]>([]);
  const [images, setImages]       = useState<IntroImage[]>([]);
  const [socials, setSocials]     = useState<IntroSocial[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const api = new FetchAPIData();
    Promise.all([
      api.requestWOParam("/cms/intro/content"),
      api.requestWOParam("/cms/intro/image"),
      api.requestWOParam("/cms/intro/socials"),
    ])
      .then(([c, img, s]) => {
        if (c.status   === "success") setContents(c.data);
        if (img.status === "success") setImages(img.data);
        if (s.status   === "success") setSocials(s.data);
      })
      .catch(() => setError("Failed to load intro content."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const api = new FetchAPIData();
    try {
      await Promise.all(
        contents.map((c) =>
          api.request(`/cms/intro/content/update/${c.fld_id}`, {
            fld_Content: c.fld_Content,
            fld_Type:    c.fld_Type,
            fld_Sort:    c.fld_Sort,
            fld_Status:  c.fld_Status,
          })
        )
      );
      await Promise.all(
        images.map((img) => {
          const fd = new FormData();
          fd.append("fld_Alt",    img.fld_Alt);
          fd.append("fld_Status", img.fld_Status);
          if (img._newFile) fd.append("fld_Image", img._newFile);
          return requestFormData(`/cms/intro/image/update/${img.fld_id}`, fd);
        })
      );
      await Promise.all(
        socials.map((s) =>
          api.request(`/cms/intro/socials/update/${s.fld_Id}`, {
            fld_SocialMedia: s.fld_SocialMedia,
            fld_URL:         s.fld_URL,
            fld_Status:      s.fld_Status,
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updateContent(id: number | undefined, value: string) {
    setContents(contents.map((c) => c.fld_id === id ? { ...c, fld_Content: value } : c));
  }

  function updateSocial(id: number | undefined, field: keyof IntroSocial, value: string) {
    setSocials(socials.map((s) => s.fld_Id === id ? { ...s, [field]: value } : s));
  }

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error)   return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-5">
      {/* Content fields — overline, heading, body sorted by fld_Sort */}
      {contents.map((item) => (
        <div key={item.fld_id}>
          <label className="mb-1.5 block text-sm font-medium capitalize text-gray-700 dark:text-gray-400">
            {item.fld_Type}
          </label>
          {item.fld_Type === "body" ? (
            <textarea
              rows={3}
              value={item.fld_Content}
              onChange={(e) => updateContent(item.fld_id, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          ) : (
            <input
              type="text"
              value={item.fld_Content}
              onChange={(e) => updateContent(item.fld_id, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          )}
        </div>
      ))}

      {/* Images */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Images</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {images.map((img, i) => (
            <div key={img.fld_id ?? i}>
              <label className="mb-1.5 block text-xs text-gray-500">
                Image {i + 1} — {img.fld_Alt || "no alt"}
              </label>
              {img.fld_Image && (
                <img
                  src={`data:image/png;base64,${img.fld_Image}`}
                  alt={img.fld_Alt}
                  className="mb-2 h-36 w-full rounded-lg object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={img.fld_Alt}
                  placeholder="Alt text"
                  onChange={(e) =>
                    setImages(images.map((im) => im.fld_id === img.fld_id ? { ...im, fld_Alt: e.target.value } : im))
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
                <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const base64 = (reader.result as string).split(",")[1];
                        setImages(images.map((im) => im.fld_id === img.fld_id ? { ...im, fld_Image: base64, _newFile: file } : im));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Social Links</p>
        <div className="space-y-2">
          {socials.map((s) => (
            <div key={s.fld_Id} className="flex gap-3">
              <input
                type="text"
                value={s.fld_SocialMedia}
                placeholder="Platform"
                onChange={(e) => updateSocial(s.fld_Id, "fld_SocialMedia", e.target.value)}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={s.fld_URL}
                placeholder="URL"
                onChange={(e) => updateSocial(s.fld_Id, "fld_URL", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved     && <span className="text-sm text-green-500">Saved successfully.</span>}
        {saveError && <span className="text-sm text-red-500">{saveError}</span>}
      </div>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const [contents, setContents]   = useState<AboutContent[]>([]);
  const [mvItems, setMvItems]     = useState<AboutMissionVision[]>([]);
  const [images, setImages]       = useState<AboutImage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const api = new FetchAPIData();
    Promise.all([
      api.requestWOParam("/cms/about/content"),
      api.requestWOParam("/cms/about/mission-vision"),
      api.requestWOParam("/cms/about/image"),
    ])
      .then(([c, mv, img]) => {
        if (c.status   === "success") setContents(c.data);
        if (mv.status  === "success") setMvItems(mv.data);
        if (img.status === "success") setImages(img.data);
      })
      .catch(() => setError("Failed to load about content."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const api = new FetchAPIData();
    try {
      // 1. Story paragraphs
      await Promise.all(
        contents.map((c) =>
          api.request(`/cms/about/content/update/${c.fld_id}`, {
            fld_Content: c.fld_Content,
            fld_Sort:    c.fld_Sort,
            fld_Status:  c.fld_Status,
          })
        )
      );
      // 2. Mission / Vision
      await Promise.all(
        mvItems.map((mv) =>
          api.request(`/cms/about/mission-vision/update/${mv.fld_id}`, {
            fld_Content: mv.fld_Content,
            fld_Type:    mv.fld_Type,
            fld_Sort:    mv.fld_Sort,
            fld_Status:  mv.fld_Status,
          })
        )
      );
      // 3. Image (FormData)
      await Promise.all(
        images.map((img) => {
          const fd = new FormData();
          fd.append("fld_Alt",    img.fld_Alt);
          fd.append("fld_Status", img.fld_Status);
          if (img._newFile) fd.append("fld_Image", img._newFile);
          return requestFormData(`/cms/about/image/update/${img.fld_id}`, fd);
        })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error)   return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-5">

      {/* About image */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">About Image</p>
        {images.map((img, i) => (
          <div key={img.fld_id ?? i}>
            {img.fld_Image && (
              <img
                src={`data:image/png;base64,${img.fld_Image}`}
                alt={img.fld_Alt}
                className="mb-2 h-36 w-full rounded-lg object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={img.fld_Alt}
                placeholder="Alt text"
                onChange={(e) =>
                  setImages(images.map((im) => im.fld_id === img.fld_id ? { ...im, fld_Alt: e.target.value } : im))
                }
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64 = (reader.result as string).split(",")[1];
                      setImages(images.map((im) => im.fld_id === img.fld_id ? { ...im, fld_Image: base64, _newFile: file } : im));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Story paragraphs */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Story Paragraphs</p>
        <div className="space-y-3">
          {contents.map((item) => (
            <div key={item.fld_id}>
              <label className="mb-1 block text-xs text-gray-500">Paragraph (Sort: {item.fld_Sort})</label>
              <textarea
                rows={3}
                value={item.fld_Content}
                onChange={(e) =>
                  setContents(contents.map((c) => c.fld_id === item.fld_id ? { ...c, fld_Content: e.target.value } : c))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">Mission & Vision</p>
        <div className="space-y-3">
          {mvItems.map((item) => (
            <div key={item.fld_id}>
              <label className="mb-1 block text-xs font-medium capitalize text-gray-500">{item.fld_Type}</label>
              <textarea
                rows={4}
                value={item.fld_Content}
                onChange={(e) =>
                  setMvItems(mvItems.map((mv) => mv.fld_id === item.fld_id ? { ...mv, fld_Content: e.target.value } : mv))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved     && <span className="text-sm text-green-500">Saved successfully.</span>}
        {saveError && <span className="text-sm text-red-500">{saveError}</span>}
      </div>
    </div>
  );
}

// ─── Gallery Section (reused for Casket & Gallery) ────────────────────────────

function GallerySection({ title }: { title: string }) {
  const [items, setItems] = useState<GalleryItem[]>(
    title === "Casket" ? defaultCasketGallery : defaultGallery
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateItem(id: number, field: keyof GalleryItem, value: string) {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function removeItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  function addItem() {
    setItems([...items, { id: Date.now(), src: "", preview: "", file: null, alt: "", active: true }]);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className={`rounded-xl border p-4 transition-colors ${item.active ? "border-gray-200 dark:border-gray-700" : "border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${item.active ? "bg-green-500" : "bg-gray-400"}`} />
                {item.active ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => setItems(items.map((i) => i.id === item.id ? { ...i, active: !i.active } : i))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  item.active
                    ? "border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                    : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                }`}
              >
                {item.active ? "Set Inactive" : "Set Active"}
              </button>
            </div>
            <ImageUploadField
              label="Image"
              value={item.src}
              onChange={(val) => updateItem(item.id, "src", val)}
            />
            <div className="mt-2">
              <label className="mb-1 block text-xs text-gray-500">Alt Text</label>
              <input
                type="text"
                value={item.alt}
                onChange={(e) => updateItem(item.id, "alt", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        + Add Image
      </button>
      <SaveButton saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(defaultTestimonials);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateItem(id: number, field: keyof Testimonial, value: string) {
    setItems(items.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  function removeItem(id: number) {
    setItems(items.filter((t) => t.id !== id));
  }

  function addItem() {
    setItems([...items, { id: Date.now(), name: "", location: "", avatar: "", message: "" }]);
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-400">Testimonial</span>
            <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Location</label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => updateItem(item.id, "location", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Avatar"
                value={item.avatar}
                onChange={(val) => updateItem(item.id, "avatar", val)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-gray-500">Message</label>
              <textarea
                rows={2}
                value={item.message}
                onChange={(e) => updateItem(item.id, "message", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        + Add Testimonial
      </button>
      <SaveButton saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

function ContactSection() {
  const [data, setData] = useState<ContactContent>(defaultContact);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields: { key: keyof ContactContent; label: string }[] = [
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "weekdayHours", label: "Weekday Hours" },
    { key: "weekendHours", label: "Weekend Hours" },
  ];

  return (
    <div className="space-y-5">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>
          <input
            type="text"
            value={data[key]}
            onChange={(e) => setData({ ...data, [key]: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
      ))}
      <SaveButton saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── Save Button ──────────────────────────────────────────────────────────────

function SaveButton({ saved, onSave }: { saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        onClick={onSave}
        className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        Save Changes
      </button>
      {saved && (
        <span className="text-sm text-green-500">Saved successfully.</span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContentManagement() {
  const [activeSection, setActiveSection] = useState<SectionTab>("intro");

  function renderSection() {
    switch (activeSection) {
      case "intro":        return <IntroSection />;
      case "about":        return <AboutSection />;
      case "casket":       return <GallerySection title="Casket" />;
      case "gallery":      return <GallerySection title="Gallery" />;
      case "testimonials": return <TestimonialsSection />;
      case "contact":      return <ContactSection />;
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
      {/* Section tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-700">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeSection === key
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div>{renderSection()}</div>
    </div>
  );
}
