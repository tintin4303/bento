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
          <div>
            <h3 className="text-lg font-bold text-gray-900">{guest.displayName || guest.username}</h3>
            <p className="text-xs text-gray-500">Connected Guest</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
