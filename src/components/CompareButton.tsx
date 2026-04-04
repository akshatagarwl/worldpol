import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompareButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function CompareButton({ onClick, disabled, loading }: CompareButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? "Comparing..." : "Compare Responses"}
    </Button>
  );
}
