"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface DishRequestInboxProps {
  pendingRequests: any[];
}

export function DishRequestInbox({ pendingRequests }: DishRequestInboxProps) {
  const [filter, setFilter] = useState<"PENDING" | "ALL">("PENDING");
  const [replyNotes, setReplyNotes] = useState<Record<string, string>>({});
  const [responded, setResponded] = useState<Record<string, boolean>>({});

  // Chef inbox fetches only pending — for ALL we'd need more data; flag for now
  const visible = pendingRequests.filter(r => !responded[r.id]);

  const handleRespond = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    const { updateDishRequestStatus } = await import("@/app/actions/requests");
    await updateDishRequestStatus(id, status, replyNotes[id] ?? "");
    setResponded(prev => ({ ...prev, [id]: true }));
  };

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">🎉</p>
        <p className="font-bold text-gray-700">All caught up!</p>
        <p className="text-sm text-gray-400 mt-1">No pending dish requests right now.</p>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">✅</p>
        <p className="font-bold text-gray-700">All responded!</p>
        <p className="text-sm text-gray-400 mt-1">Refresh the page to see updated status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 font-semibold">
        {visible.length} pending request{visible.length !== 1 ? "s" : ""}
      </p>

      {visible.map(req => (
        <div key={req.id} className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-black text-gray-900">{req.dishName}</p>
                <p className="text-xs text-secondary font-semibold mt-0.5">
                  {req.guest.displayName || req.guest.username}
                </p>
              </div>
              <p className="text-[10px] text-gray-400 flex-shrink-0">
                {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {req.notes && (
              <p className="text-xs text-gray-500 italic mt-2 bg-pink-50 rounded-lg px-3 py-1.5">
                "{req.notes}"
              </p>
            )}
          </div>

          {/* Reply note input */}
          <div className="px-4 pb-3">
            <input
              type="text"
              placeholder="Add a reply note (optional)..."
              value={replyNotes[req.id] ?? ""}
              onChange={e => setReplyNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-100 focus:outline-none focus:border-secondary transition-colors bg-gray-50"
            />
          </div>

          {/* Action buttons */}
          <div className="flex border-t border-pink-50">
            <button
              onClick={() => handleRespond(req.id, "ACCEPTED")}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
            >
              <CheckCircle size={15} />
              Accept
            </button>
            <div className="w-px bg-pink-50" />
            <button
              onClick={() => handleRespond(req.id, "REJECTED")}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold text-red-400 hover:bg-red-50 transition-colors"
            >
              <XCircle size={15} />
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
