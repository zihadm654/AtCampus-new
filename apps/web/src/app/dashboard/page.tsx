"use client";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard() {
	const { data: session, isPending } = useSession();
	if (!session) {
		return redirect("/login");
	}
	const privateData = useQuery(trpc.privateData.queryOptions());

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<p>privateData: {privateData.data?.message}</p>
		</div>
	);
}
