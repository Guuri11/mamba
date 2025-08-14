import { AlertTriangle } from "lucide-react";
import { cn } from "~/lib/utils";

export function DeviationAlertIcon({ className }: { className?: string }) {
  return (
    <AlertTriangle className={cn("text-yellow-500 w-5 h-5 inline-block mr-1 align-middle", className)} aria-label="Alerta de desviación" />
  );
}
