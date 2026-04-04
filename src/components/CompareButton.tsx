import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function CompareButton({ onClick, disabled, loading }: CompareButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-colors",
        disabled || loading
          ? "cursor-not-allowed bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Comparing..." : "Compare Responses"}
    </button>
  );
}
