import { useState } from "react";
import { X, ListPlus, Trash2, Plus } from "lucide-react";
import { cn } from "../utils/cn";
import { MediaImage } from "./MediaImage";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { Review, UserList } from "../types";

interface ListsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lists: UserList[];
  reviews: Review[];
  onCreateList: (list: Omit<UserList, "id" | "createdAt">) => void;
  onDeleteList: (id: string) => void;
  onReviewClick: (review: Review) => void;
  pendingReviewId?: number | null;
  onAddToList?: (listId: string, reviewId: number) => void;
}

const GRADIENTS = [
  "from-coral to-rose-500",
  "from-violet to-purple-600",
  "from-teal to-cyan-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-600",
  "from-fuchsia-400 to-pink-600",
];

export function ListsDrawer({
  isOpen,
  onClose,
  lists,
  reviews,
  onCreateList,
  onDeleteList,
  onReviewClick,
  pendingReviewId,
  onAddToList,
}: ListsDrawerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(0);

  useLockBodyScroll(isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreateList({
      name: newListName,
      description: newListDesc,
      reviewIds: pendingReviewId ? [pendingReviewId] : [],
      gradient: GRADIENTS[selectedGradient],
    });
    setNewListName("");
    setNewListDesc("");
    setShowForm(false);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-[60] modal-overlay" onClick={onClose} />}

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[28rem] z-[70] glass-strong shadow-2xl transform transition-transform duration-300 ease-out overscroll-contain",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet to-purple-600 text-white">
                <ListPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Lists</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{lists.length} custom collection{lists.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
              aria-label="Close lists"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {pendingReviewId && (
              <div className="mb-4 p-3 rounded-xl bg-coral/10 border border-coral/20 text-sm text-coral font-semibold">
                Select a list to add this title, or create a new one.
              </div>
            )}

            <button
              onClick={() => setShowForm((s) => !s)}
              className="w-full mb-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet to-purple-600 text-white text-sm font-semibold shadow-lg hover:shadow-violet/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New List
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 mb-4">
                <input
                  type="text"
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm mb-3"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm mb-3"
                />
                <div className="flex gap-2 mb-3">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedGradient(i)}
                      className={cn(
                        "h-8 w-8 rounded-full bg-gradient-to-r",
                        g,
                        selectedGradient === i && "ring-2 ring-offset-2 ring-coral"
                      )}
                      aria-label={`Select gradient ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {lists.length === 0 ? (
                <div className="text-center py-10">
                  <ListPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">No lists yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create collections like "Best Horror" or "Summer 2024"</p>
                </div>
              ) : (
                lists.map((list) => {
                  const listReviews = reviews.filter((r) => list.reviewIds.includes(r.id));
                  return (
                    <div key={list.id} className="glass rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-sm", list.gradient)}>
                            <ListPlus className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{list.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{list.reviewIds.length} titles</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteList(list.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          aria-label="Delete list"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {list.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{list.description}</p>
                      )}

                      {pendingReviewId && onAddToList && !list.reviewIds.includes(pendingReviewId) && (
                        <button
                          onClick={() => onAddToList(list.id, pendingReviewId)}
                          className="w-full mb-3 py-2 rounded-xl text-sm font-semibold bg-coral/10 text-coral hover:bg-coral/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          Add to this list
                        </button>
                      )}

                      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                        {listReviews.map((review) => (
                          <button
                            key={review.id}
                            onClick={() => { onReviewClick(review); onClose(); }}
                            className="flex-shrink-0 text-left group"
                          >
                            <div className="h-16 w-11 rounded-lg overflow-hidden bg-gray-900 border border-white/20 mb-1 shadow-sm">
                              <MediaImage
                                src={review.imageUrl}
                                alt={review.title}
                                category={review.category}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-[10px] text-gray-600 dark:text-gray-300 line-clamp-1 w-11 group-hover:text-coral transition-colors">
                              {review.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
