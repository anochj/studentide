import { getUserIDESessions } from "@/actions/ide-sessions";

export default async function IdeSessionsPage() {
  const sessions = await getUserIDESessions();

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">IDE Sessions</h1>
      <p className="text-muted-foreground">
        Resume and manage active coding environments here.
      </p>
      {
        sessions.data?.sessions.map((session) => (
          // TODO: Add data, a button that appears to restart the proxy, etc
          <div
            key={session.id}
            className="w-full rounded-md border p-4 text-left"
          >
            <h2 className="text-lg font-semibold">
              Session for Project ID: {session.project_id}
            </h2>
            <p>Status: {session.status}</p>
            <p>Started At: {new Date(session.started_at).toLocaleString()}</p>
          </div>
        ))
      }
    </section>
  );
}
