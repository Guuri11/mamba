import { createFileRoute } from "@tanstack/react-router";
import { MambaSidebar } from "../components/mamba-sidebar";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";
import { UserCircle2, Sparkles, Calendar, ListTodo, Bot } from "lucide-react";
import { useWelcomeMessage } from "../hooks/use-welcome-message";
import { RollingText } from "../components/ui/shadcn-io/rolling-text";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const { data: user, loading } = useWelcomeMessage();

  return (
    <MambaSidebar>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background to-muted/40 min-h-screen">
        {/* Welcome Section */}
        <div className="flex items-center gap-4 min-h-[56px]">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <UserCircle2 className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {loading ? (
                "..."
              ) : (
                <RollingText text={t("home.welcome", { name: user?.name ?? "" })} />
              )}
            </h1>
            <p className="text-muted-foreground">
              {t("home.suggestion")}
            </p>
          </div>
        </div>

        {/* Assistant Panel Placeholder */}
        <div className="bg-muted/60 rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <Bot className="w-8 h-8 text-primary" />
          <div>
            <div className="font-semibold">{t("home.assistant.title")}</div>
            <div className="text-muted-foreground text-sm">{t("home.assistant.tip")}</div>
          </div>
          <Button variant="default" className="ml-auto">
            {t("home.assistant.invoke")}
          </Button>
        </div>
      </div>
    </MambaSidebar>
  );
}
