import React from "react";
import TransportTimeline from "@/components/transport/TransportTimeline";
import { demoRoutePlan } from "@/lib/transportTypes";

export default function TransportLiveDemo() {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="text-center mb-8">
        <h3 className="font-mono text-2xl font-bold">TRANSPORT.HUB (PREVIEW)</h3>
        <p className="text-muted-foreground text-sm">Coming soon: live routing & real-time data</p>
      </div>

      {/* Timeline widget */}
      <TransportTimeline plan={demoRoutePlan} />
    </div>
  );
}
