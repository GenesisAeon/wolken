import { createFileRoute } from "@tanstack/react-router";
import { CloudCanvas } from "@/components/cloud-canvas";
import { CcReadout } from "@/components/cc-readout";
import { ControlPanel } from "@/components/control-panel";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
      <section className="relative h-stage min-h-60 shrink-0 overflow-hidden lg:h-full lg:min-h-0 lg:flex-1">
        <CloudCanvas />
        <CcReadout />
      </section>
      <div className="w-full shrink-0 lg:h-full lg:min-h-0 lg:w-panel">
        <ControlPanel />
      </div>
    </main>
  );
}
