import { useState } from "react";
import { toast } from "react-toastify";
import { Check, Share } from "lucide-react";
import Button from "../../../components/ui/Button";

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
    <Button onClick={handleShare} variant="secondary" className="flex items-center gap-2 self-end md:self-auto">
      {copied ? <Check size={20} className="text-success" /> : <Share size={20} />}
      <span>{copied ? "Copied!" : "Share"}</span>
    </Button>
  );
};

export default ShareButton;
