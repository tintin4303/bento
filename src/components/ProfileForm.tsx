"use client";

import { useRef, useState, useTransition } from "react";
import { updateDisplayName, updateAvatar, updatePreferences } from "@/app/actions/profile";
import { Check, Pencil, Loader2, X } from "lucide-react";

interface ProfileFormProps {
  user: {
    avatarUrl?: string | null;
    displayName?: string | null;
    username: string;
    chefCode?: string | null;
    likes?: string[];
    dislikes?: string[];
    allergies?: string[];
  };
  isChef: boolean;
}

/* ─── Avatar Upload ─── */
function AvatarUpload({ avatarUrl, isChef }: { avatarUrl?: string | null; isChef: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.set("avatar", file);
    startTransition(async () => {
      await updateAvatar(formData);
    });
  };

  const src = preview ?? avatarUrl;

  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      {src ? (
        <img src={src} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-pink-100 shadow-md" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-4xl shadow-md">
          {isChef ? "👨‍🍳" : "💁‍♀️"}
        </div>
      )}

      {/* Edit overlay */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={pending}
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-600 active:scale-90 transition-all"
        aria-label="Change avatar"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

/* ─── Inline Name Field ─── */
function DisplayNameField({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const isDirty = value.trim() !== defaultValue;

  const handleSave = () => {
    const formData = new FormData();
    formData.set("displayName", value);
    startTransition(async () => {
      await updateDisplayName(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Display Name</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          onKeyDown={(e) => { if (e.key === "Enter" && isDirty) handleSave(); }}
          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all font-semibold text-gray-900"
          placeholder="e.g. Chef Jo"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || pending}
          aria-label="Save name"
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-all
            ${saved
              ? "bg-green-100 text-green-600"
              : isDirty
              ? "bg-secondary text-white hover:bg-pink-600 active:scale-90"
              : "bg-gray-100 text-gray-300"
            }`}
        >
          {pending ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Check size={15} />}
        </button>
      </div>
    </div>
  );
}

/* ─── Tags Input ─── */
function TagsInput({
  name,
  label,
  initialTags,
  placeholder,
  theme = "green",
}: {
  name: string;
  label: string;
  initialTags: string[];
  placeholder: string;
  theme?: "green" | "red" | "orange";
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState("");

  const commit = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) setTags((prev) => [...prev, val]);
    setInput("");
  };

  const remove = (i: number) => setTags((prev) => prev.filter((_, idx) => idx !== i));

  const pillStyle = {
    green:  "bg-green-50  text-green-700  border-green-100",
    red:    "bg-red-50    text-red-700    border-red-100",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  }[theme];

  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag, i) => (
            <span key={i} className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${pillStyle}`}>
              {tag}
              <button type="button" onClick={() => remove(i)} className="hover:opacity-70 transition-opacity ml-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); } }}
          onBlur={commit}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all text-sm"
          placeholder={placeholder}
        />
      </div>

      <input type="hidden" name={name} value={tags.join(",")} />
    </div>
  );
}

/* ─── Preferences Section ─── */
function PreferencesSection({ user }: { user: ProfileFormProps["user"] }) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      await updatePreferences(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSave} className="space-y-5">
      <TagsInput name="likes"     label="I love eating"     initialTags={user.likes     ?? []} placeholder="Add item, press Enter" theme="green" />
      <TagsInput name="dislikes"  label="I can't stand"     initialTags={user.dislikes  ?? []} placeholder="Add item, press Enter" theme="red" />
      <TagsInput name="allergies" label="I'm allergic to"   initialTags={user.allergies ?? []} placeholder="Add item, press Enter" theme="orange" />

      <button
        type="submit"
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
          saved
            ? "bg-green-100 text-green-700"
            : "bg-pink-50 text-secondary hover:bg-pink-100 border border-pink-200"
        }`}
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
        {saved ? "Saved!" : "Save Preferences"}
      </button>
    </form>
  );
}

/* ─── Main Component ─── */
export function ProfileForm({ user, isChef }: ProfileFormProps) {
  return (
    <div className="flex flex-col items-center gap-6">

      {/* Avatar + Name */}
      <div className="flex flex-col items-center w-full">
        <AvatarUpload avatarUrl={user.avatarUrl} isChef={isChef} />
        <p className="text-xs text-gray-400 mb-5">Tap the pencil to change photo</p>

        {isChef && user.chefCode && (
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-5 w-full text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Secret Chef Code</p>
            <p className="text-3xl font-black text-secondary tracking-widest">{user.chefCode}</p>
            <p className="text-xs text-gray-400 mt-1">Share with guests to connect!</p>
          </div>
        )}

        <div className="w-full">
          <DisplayNameField defaultValue={user.displayName || ""} />
        </div>
      </div>

      {/* Preferences (guests only) */}
      {!isChef && (
        <div className="w-full space-y-1 border-t border-pink-50 pt-5">
          <PreferencesSection user={user} />
        </div>
      )}
    </div>
  );
}
