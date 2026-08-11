"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface ProfileFormProps {
  user: {
    avatarUrl?: string | null;
    displayName?: string | null;
    username: string;
    chefCode?: string | null;
  };
  isChef: boolean;
}

function TagsInput({ 
  name, 
  label, 
  initialTags, 
  placeholder,
  theme = "pink"
}: { 
  name: string; 
  label: string; 
  initialTags: string[]; 
  placeholder: string;
  theme?: "pink" | "green" | "red";
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
    }
    setInput("");
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  const colorStyles = {
    pink: "bg-pink-50 text-secondary border-pink-100",
    green: "bg-green-50 text-green-700 border-green-100",
    red: "bg-red-50 text-red-700 border-red-100",
  }[theme];

  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span 
            key={i} 
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border ${colorStyles}`}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="hover:opacity-70 transition-opacity ml-1"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all text-sm"
          placeholder={placeholder}
        />
        <Button 
          type="button" 
          onClick={addTag}
          variant="outline"
          className="text-xs px-4 py-0"
        >
          Add
        </Button>
      </div>

      {/* Hidden input to submit the comma-separated array to the server action */}
      <input type="hidden" name={name} value={tags.join(",")} />
    </div>
  );
}

export function ProfileForm({ user, isChef }: ProfileFormProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-8">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-pink-100 shadow-md mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-4xl shadow-md mb-4">
            {isChef ? "👨‍🍳" : "💁‍♀️"}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{user.displayName || user.username}</h1>
        <p className="text-gray-500 font-semibold">{isChef ? "Chef Profile" : "Guest Profile"}</p>
      </div>

      {isChef && user.chefCode && (
        <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-8 w-full text-center">
          <p className="text-sm text-gray-500 font-bold mb-1">Your Secret Chef Code</p>
          <h2 className="text-3xl font-black text-secondary tracking-widest">{user.chefCode}</h2>
          <p className="text-xs text-gray-400 mt-2">Give this code to your guest so they can connect with you!</p>
        </div>
      )}

      <form action={updateProfile} className="space-y-6 w-full">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
            <input 
              name="displayName" 
              type="text" 
              defaultValue={user.displayName || ""} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all font-medium"
              placeholder="e.g. Master Chef"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Update Avatar Picture</label>
            <input 
              name="avatar" 
              type="file" 
              accept="image/*"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary transition-all file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-secondary hover:file:bg-pink-100 text-sm text-gray-500"
            />
          </div>
        </div>

        {!isChef && (
          <div className="space-y-6 pt-4 border-t border-pink-50">
            <TagsInput 
              name="likes" 
              label="I love eating... (Likes)" 
              initialTags={(user as any).likes || []} 
              placeholder="e.g. Sushi, Steak"
              theme="green"
            />
            <TagsInput 
              name="dislikes" 
              label="I can't stand... (Dislikes)" 
              initialTags={(user as any).dislikes || []} 
              placeholder="e.g. Cilantro, Mushrooms"
              theme="red"
            />
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full py-3 text-lg mt-6 shadow-lg shadow-pink-200">
          Save Profile
        </Button>
      </form>
    </div>
  );
}
