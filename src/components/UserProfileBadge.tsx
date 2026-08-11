import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function UserProfileBadge() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const user = session.user as any;
  const displayName = user.displayName || user.name;
  const avatarUrl = user.avatarUrl;

  return (
    <Link href="/profile" className="flex items-center gap-3 hover:bg-pink-50 p-2 rounded-xl transition-colors">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-gray-900 leading-tight">{displayName}</p>
        <p className="text-xs text-gray-400 font-semibold">{user.role === "ADMIN" ? "Chef" : "Guest"}</p>
      </div>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-pink-100" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">
          {user.role === "ADMIN" ? "👨‍🍳" : "💁‍♀️"}
        </div>
      )}
    </Link>
  );
}
