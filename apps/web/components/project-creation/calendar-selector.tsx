"use client";

import { useState } from "react";
import { Clock2Icon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

type CalendarSelectorProps = {
	timeLabel: string;
	onChange?: (value: Date | undefined) => void;
};

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function CalendarSelector({
	timeLabel,
	onChange,
}: CalendarSelectorProps) {
	const [dateTime, setDateTime] = useState<Date | undefined>(() => {
		const now = new Date();
		return new Date(
			now.getFullYear(),
			now.getMonth(),
			12,
			now.getHours(),
			now.getMinutes(),
			now.getSeconds(),
		);
	});

	const handleDateSelect = (selected: Date | undefined) => {
		setDateTime((prev) => {
			if (!selected) {
				onChange?.(undefined);
				return undefined;
			}

			const base = prev ?? selected;
			const next = new Date(selected);
			next.setHours(
				base.getHours(),
				base.getMinutes(),
				base.getSeconds(),
				base.getMilliseconds(),
			);
			onChange?.(next);
			return next;
		});
	};

	const handleTimeChange = (value: string) => {
		setDateTime((prev) => {
			const base = prev ?? new Date();
			const [hours, minutes, seconds] = value
				.split(":")
				.map((segment) => Number(segment || 0));
			const next = new Date(base);
			next.setHours(hours || 0, minutes || 0, seconds || 0, 0);
			onChange?.(next);
			return next;
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline"> {dateTime?.toLocaleString()}</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" asChild>
				<Card size="sm" className="mx-auto w-fit">
					<CardContent>
						<Calendar
							mode="single"
							selected={dateTime}
							onSelect={handleDateSelect}
							className="p-0"
						/>
					</CardContent>
					<CardFooter className="border-t bg-card">
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="time-from">{timeLabel}</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="time-from"
										type="time"
										step="1"
										value={dateTime ? dateTime.toTimeString().slice(0, 8) : ""}
										onChange={(event) => handleTimeChange(event.target.value)}
										className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
									/>
									<InputGroupAddon>
										<Clock2Icon className="text-muted-foreground" />
									</InputGroupAddon>
								</InputGroup>
							</Field>
						</FieldGroup>
					</CardFooter>
				</Card>
			</PopoverContent>
		</Popover>
	);
}
