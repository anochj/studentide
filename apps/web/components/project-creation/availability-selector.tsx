"use client";

import { Calendar, InfinityIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/lib/validations/project";
import { CalendarSelector } from "./calendar-selector";
import { Button } from "../ui/button";

type AvailabilityMode = Project["availability"];

type AvailabilitySelectorProps = {
	value?: AvailabilityMode;
	onChange?: (value: AvailabilityMode) => void;
	onOpensAtChange?: (value: Date | undefined) => void;
	onClosesAtChange?: (value: Date | undefined) => void;
};

export function AvailabilitySelector({
	value,
	onChange,
	onOpensAtChange,
	onClosesAtChange,
}: AvailabilitySelectorProps) {
	const [mode, setMode] = useState<AvailabilityMode>(value || "open");
	const [opensAt, setOpensAt] = useState<Date | undefined>(undefined);
	const [closesAt, setClosesAt] = useState<Date | undefined>(undefined);

	useEffect(() => {
		onChange?.(mode);
		onOpensAtChange?.(mode === "custom" ? opensAt : undefined);
		onClosesAtChange?.(mode === "custom" ? closesAt : undefined);
	}, [mode, opensAt, closesAt, onChange, onOpensAtChange, onClosesAtChange]);

	return (
		<Tabs
			value={mode}
			onValueChange={(value) => setMode(value as AvailabilityMode)}
			className="w-full"
		>
			<TabsList className="grid w-full grid-cols-2 min-h-12">
				<TabsTrigger value="open">
					<InfinityIcon /> Always Open
				</TabsTrigger>
				<TabsTrigger value="custom">
					<Calendar />
					Custom Schedule
				</TabsTrigger>
			</TabsList>

			<TabsContent value="open" className="">
				<Card>
					<CardHeader>
						<CardDescription>
							Students can access the project at any time. No open or due dates
							are required.
						</CardDescription>
					</CardHeader>
				</Card>
			</TabsContent>
			<TabsContent value="custom" className="">
				<Card>
					<CardHeader>
						<CardDescription>
							Students can access the project only between the open and due
							dates that you set.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						<FieldGroup className="grid gap-6 sm:grid-cols-1">
							<Field>
								<FieldLabel>Open date</FieldLabel>
								<div className="flex items-center gap-3">
									<CalendarSelector
										timeLabel="Opens at"
										onChange={setOpensAt}
									/>
								</div>
							</Field>
							<Field>
								<FieldLabel>Due date</FieldLabel>
								<div className="flex items-center gap-3">
									<CalendarSelector
										timeLabel="Closes at"
										onChange={setClosesAt}
									/>
								</div>
							</Field>
						</FieldGroup>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
