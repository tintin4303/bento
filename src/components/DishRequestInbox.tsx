"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { usePolling } from "@/hooks/usePolling";

interface DishRequestInboxProps {
  pendingRequests: any[];
}

export function DishRequestInbox({ pendingRequests: initialRequests }: DishRequestInboxProps) {
  const [replyNotes, setReplyNotes] = useState<Record<string, string>>({});
  const [responded, setResponded] = useState<Record<string, boolean>>({});

  // Live polling — new guest requests appear instantly
  const { pendingRequests, pastRequests = [] } = usePolling(
    "/api/chef/requests",
    { pendingRequests: initialRequests, pastRequests: [] },
    3000
  );

  const visible = pendingRequests.filter((r: any) => !responded[r.id]);

  const handleRespond = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    // Optimistic UI: hide it instantly
    setResponded(prev => ({ ...prev, [id]: true }));
    
    // Background server call
    const { updateDishRequestStatus } = await import("@/app/actions/requests");
    await updateDishRequestStatus(id, status, replyNotes[id] ?? "");
  };

  return (
    <div className="space-y-8">
      {/* ─── PENDING REQUESTS ─── */}
      <div className="space-y-4">
        <p className="text-xs text-gray-400 font-semibold">
          {visible.length} pending request{visible.length !== 1 ? "s" : ""}
        </p>

        {visible.length === 0 && (
          <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-pink-200">
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-bold text-gray-700 text-sm">All caught up!</p>
          </div>
        )}

        {visible.map((req: any) => (
          <div key={req.id} className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
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

      {/* ─── PAST REQUESTS ─── */}
      {pastRequests.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-pink-100/50">
          <p className="text-xs text-gray-400 font-semibold mb-2">Past Responses</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {pastRequests.map((req: any) => (
              <div key={req.id} className="bg-gray-50/50 rounded-xl border border-gray-100 p-3 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-600 truncate">{req.dishName}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      from {req.guest.displayName || req.guest.username}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    req.status === "ACCEPTED" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"
                  }`}>
                    {req.status}
                  </span>
                </div>
                {req.replyNote && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-start gap-1.5">
                    <span className="text-[10px]">💬</span>
                    <p className="text-[11px] text-gray-500 italic line-clamp-2">"{req.replyNote}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
