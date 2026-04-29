"use client";

import { useEffect, useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarSelector } from "./calendar-selector";

type AvailabilityMode = "always" | "custom";

type AvailabilityValue = {
	mode: AvailabilityMode;
	opensAt?: Date;
	closesAt?: Date;
};

type AvailabilitySelectorProps = {
	onChange?: (value: AvailabilityValue) => void;
};

export function AvailabilitySelector({ onChange }: AvailabilitySelectorProps) {
	const [mode, setMode] = useState<AvailabilityMode>("always");
	const [opensAt, setOpensAt] = useState<Date | undefined>(undefined);
	const [closesAt, setClosesAt] = useState<Date | undefined>(undefined);

	useEffect(() => {
		onChange?.({ mode, opensAt, closesAt });
	}, [mode, opensAt, closesAt, onChange]);

	return (
		<Tabs
			value={mode}
			onValueChange={(value) => setMode(value as AvailabilityMode)}
			className="w-[400px]"
		>
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="always">Always Open</TabsTrigger>
				<TabsTrigger value="custom">Custom Schedule</TabsTrigger>
			</TabsList>
			<TabsContent value="always" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Always Open</CardTitle>
						<CardDescription>
							Students can access the project at any time. No open or due dates
							are required. Switch to Custom Schedule to set optional open and
							due dates.
						</CardDescription>
					</CardHeader>
				</Card>
			</TabsContent>
			<TabsContent value="custom" className="mt-4">
				<Card>
					<CardHeader>
						<CardTitle>Custom Schedule</CardTitle>
						<CardDescription>
							Set specific open and due dates for the project. Students can only
							access the project during the specified time frame.
						</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						<FieldGroup className="grid gap-6 sm:grid-cols-2">
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
