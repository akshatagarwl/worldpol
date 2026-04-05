import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompareButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function CompareButton({ onClick, disabled, loading }: CompareButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled || loading} size="lg" className="w-full">
      {loading && <Loader2 className="animate-spin" />}
      {loading ? "Comparing..." : "Compare Responses"}
    </Button>
  );
}
