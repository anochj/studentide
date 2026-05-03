import { getUserIDESessions } from "@/actions/ide-sessions";
import IDESessionCard from "@/components/ide-session-card";

export default async function IdeSessionsPage() {
	const response = await getUserIDESessions();

	if (response.serverError || !response.data) {
		return <h1>No IDE sessions found {response.serverError}</h1>;
	}

  const { sessions } = response.data;

	return (
		// <section className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
		//   <h1 className="text-2xl font-bold">IDE Sessions</h1>
		//   <p className="text-muted-foreground">
		//     Resume and manage active coding environments here.
		//   </p>
		//   {
		//     sessions.data?.sessions.map((session) => (
		//       // TODO: Add data, a button that appears to restart the proxy, etc
		//       <div
		//         key={session.id}
		//         className="w-full rounded-md border p-4 text-left"
		//       >
		//         <h2 className="text-lg font-semibold">
		//           Session for Project ID: {session.project_id}
		//         </h2>
		//         <p>Status: {session.status}</p>
		//         <p>Started At: {new Date(session.started_at).toLocaleString()}</p>
		//       </div>
		//     ))
		//   }
		// </section>
		<section>
			{sessions.map((session) => (
				<IDESessionCard
					key={session.id}
					icon={session.environment.icon || ""}
					name={session.project.name}
					project_slug={session.project.slug}
					ide_identifier={session.identifier}
					started_at={new Date(session.started_at)}
					status={session.status}
					submitted={!!session.submission}
					ended_at={session.ended_at ? new Date(session.ended_at) : null}
					due_date={
						session.project.availability_closes
							? new Date(session.project.availability_closes)
							: undefined
					}
				/>
			))}
		</section>
	);
}
