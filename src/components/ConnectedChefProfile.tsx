import { Card } from "./ui/Card";

interface ConnectedChefProfileProps {
  chef: {
    displayName: string | null;
    username: string;
    avatarUrl: string | null;
  } | null;
}

export function ConnectedChefProfile({ chef }: ConnectedChefProfileProps) {
  if (!chef) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You are not connected to a chef yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-4">
        {chef.avatarUrl ? (
          <img src={chef.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-pink-100 shadow-md mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-4xl shadow-md mb-4">
            👨‍🍳
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900">{chef.displayName || chef.username}</h2>
        <p className="text-gray-500 font-semibold">Your Personal Chef</p>
      </div>
      
      <Card className="w-full bg-pink-50/50 border-pink-100 mt-4 p-4 text-center">
        <p className="text-sm text-gray-600">
          This is the talented chef preparing your meals! You can request custom dishes or leave feedback for them using the other menu options.
        </p>
      </Card>
    </div>
  );
}
