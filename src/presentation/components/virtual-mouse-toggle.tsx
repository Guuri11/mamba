import * as React from "react";
import { Switch } from "./ui/switch";
import { useVirtualMouseStore } from "../lib/stores/virtual-mouse";
import { VirtualMouseTauriAdapter } from "@infrastructure/repositories/virtual-mouse/virtual-mouse-tauri-adapter";
import { MouseIcon } from "lucide-react";

const adapter = new VirtualMouseTauriAdapter();

export function VirtualMouseToggle() {
  const isActive = useVirtualMouseStore((s) => s.isActive);
  const setActive = useVirtualMouseStore((s) => s.setActive);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    adapter.isActive().then(setActive);
  }, [setActive]);

  const handleChange = async (checked: boolean) => {
    setLoading(true);
    try {
      if (checked) {
        await adapter.activate();
      } else {
        await adapter.deactivate();
      }
      setActive(checked);
    } catch (e) {
      // TODO: show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <MouseIcon className={isActive ? "text-primary" : "text-muted-foreground"} />
      <Switch
        id="virtual-mouse-switch"
        checked={isActive}
        disabled={loading}
        onCheckedChange={handleChange}
        aria-label="Ratón virtual"
      />
    </div>
  );
}
