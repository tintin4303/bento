import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface DishRequestInboxProps {
  pendingRequests: any[];
}

export function DishRequestInbox({ pendingRequests }: DishRequestInboxProps) {
  return (
    <div className="w-full">
      {pendingRequests.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No pending requests right now.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(req => (
            <Card key={req.id} className="border border-pink-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{req.dishName}</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-1">From: {req.guest.displayName || req.guest.username}</p>
                  {req.notes && <p className="text-sm text-gray-600 italic mt-1">"{req.notes}"</p>}
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <form action={async () => {
                  "use server";
                  const { updateDishRequestStatus } = await import("@/app/actions/requests");
                  await updateDishRequestStatus(req.id, "ACCEPTED");
                }} className="flex-1">
                  <Button variant="primary" className="w-full text-xs py-2 bg-green-500 hover:bg-green-600 shadow-green-200">
                    Accept 🧑‍🍳
                  </Button>
                </form>
                <form action={async () => {
                  "use server";
                  const { updateDishRequestStatus } = await import("@/app/actions/requests");
                  await updateDishRequestStatus(req.id, "REJECTED");
                }} className="flex-1">
                  <Button variant="outline" className="w-full text-xs py-2 text-red-500 border-red-200 hover:bg-red-50">
                    Decline 🙅‍♂️
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
