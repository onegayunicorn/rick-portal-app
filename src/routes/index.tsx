import { createFileRoute } from "@tanstack/react-router";
import { PortalConsole } from "@/components/portal/PortalConsole";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <PortalConsole />;
}
