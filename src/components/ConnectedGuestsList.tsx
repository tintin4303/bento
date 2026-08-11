import { Card } from "./ui/Card";

interface ConnectedGuestsListProps {
  guests: {
    id: string;
    displayName: string | null;
    username: string;
    avatarUrl: string | null;
  }[];
}

export function ConnectedGuestsList({ guests }: ConnectedGuestsListProps) {
  if (guests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You don't have any guests connected yet.</p>
        <p className="text-sm text-gray-400 mt-2">Give them your Secret Chef Code from your profile to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-4">You are cooking for {guests.length} guest{guests.length === 1 ? '' : 's'}!</p>
      {guests.map(guest => (
        <Card key={guest.id} className="flex items-center gap-4 p-4 border border-pink-100">
          {guest.avatarUrl ? (
            <img src={guest.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-pink-100 shadow-sm" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl shadow-sm">
              💁‍♀️
            </div>
          )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{guest.displayName || guest.username}</h3>
              
              {((guest as any).likes?.length > 0 || (guest as any).dislikes?.length > 0) && (
                <div className="mt-2 space-y-1.5">
                  {(guest as any).likes?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1 mt-0.5">Likes</span>
                      {(guest as any).likes.map((like: string, i: number) => (
                        <span key={i} className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                          {like}
                        </span>
                      ))}
                    </div>
                  )}
                  {(guest as any).dislikes?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1 mt-0.5">Dislikes</span>
                      {(guest as any).dislikes.map((dislike: string, i: number) => (
                        <span key={i} className="text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                          {dislike}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  }
