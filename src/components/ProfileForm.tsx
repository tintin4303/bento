"use client";

import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  user: {
    avatarUrl?: string | null;
    displayName?: string | null;
    username: string;
    chefCode?: string | null;
  };
  isChef: boolean;
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

      <form action={updateProfile} className="space-y-4 w-full">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
          <input 
            name="displayName" 
            type="text" 
            defaultValue={user.displayName || ""} 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-pink-100 transition-all font-medium"
            placeholder="e.g. Master Chef"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Update Avatar Picture</label>
          <input 
            name="avatar" 
            type="file" 
            accept="image/*"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-secondary hover:file:bg-pink-100"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full py-3 text-lg mt-4 shadow-lg shadow-pink-200">
          Save Profile
        </Button>
      </form>
    </div>
  );
}
