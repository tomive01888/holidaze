import { useState } from "react";
import { toast } from "react-toastify";
import { Check, Share } from "lucide-react";
import Button from "../../../components/ui/Button";

/**
 * ShareButton component allows users to copy the current page URL to their clipboard.
 * It provides visual feedback and toast notifications on success or failure.
 *
 * @component
 * @example
 * return <ShareButton />;
 */
const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy link.");
      });
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant="secondary"
        className="flex items-center gap-2 self-end md:self-auto"
        aria-label={copied ? "Link copied" : "Copy link to clipboard"}
      >
        {copied ? (
          <Check size={20} className="text-success" aria-hidden="true" />
        ) : (
          <Share size={20} aria-hidden="true" />
        )}
        <span>{copied ? "Copied!" : "Share"}</span>
      </Button>
      {/* Screen reader only live region */}
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </>
  );
};

export default ShareButton;
