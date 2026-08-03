import { useState } from "react";
import { X, Share2, MessageCircle, Copy, Check, Star } from "lucide-react";
import { MediaImage } from "./MediaImage";
import type { Review } from "../types";

interface ShareCardProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ShareCard({ review, isOpen, onClose }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !review) return null;

  const shareUrl = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  const shareText = `Check out my review of ${review.title} on PopCritic! ⭐ ${review.rating}/5`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 modal-overlay modal-overlay-animate">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden modal-animate border border-white/20">
        {/* Card Header with real artwork image */}
        <div className="relative h-44 bg-gray-950 overflow-hidden">
          <MediaImage
            src={review.imageUrl}
            alt={review.title}
            category={review.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            aria-label="Close share card"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
                {review.category}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-white" />
                {review.rating}
              </div>
            </div>
            <h3 className="text-2xl font-bold">{review.title}</h3>
            <p className="text-white/90 text-sm">{review.creator}</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
            "{review.excerpt}"
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {review.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-coral" />
              Share this review
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleTwitter}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1DA1F2] text-white text-sm font-semibold hover:bg-[#1a91da] transition-colors"
              >
                <TwitterIcon />
                Twitter
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* PopCritic Branding */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Shared from <span className="font-bold text-coral">PopCritic</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
