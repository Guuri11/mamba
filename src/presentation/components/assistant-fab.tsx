// Floating Action Button for Mamba Assistant
import { useNavigate } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export function AssistantFAB({ className }: { className?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      aria-label={t("home.assistant.invoke")}
      onClick={() => navigate({ to: "/assistant" })}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-primary shadow-xl hover:scale-105 transition-transform duration-300 ease-out hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/60 animate-float",
        className
      )}
    >
      <Bot className="w-6 h-6 mr-2 animate-bounce" />
      <span className="font-semibold text-base drop-shadow">
        {t("home.assistant.invoke")}
      </span>
    </Button>
  );
}

// Add a simple floating animation
// Add this to your global CSS or index.css:
// .animate-float {
//   animation: float 2.5s ease-in-out infinite;
// }
// @keyframes float {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-12px); }
// }
