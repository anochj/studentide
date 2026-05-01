"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type CalendarProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
>;

type TimeInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "defaultValue" | "onChange"
>;

export type DateTimePickerProps = Omit<
  React.ComponentProps<typeof Button>,
  "value" | "defaultValue" | "onChange"
> & {
  value?: Date;
  defaultValue?: Date;
  onChange?: (value: Date | undefined) => void;
  placeholder?: string;
  displayFormat?: string;
  timeLabel?: string;
  showSeconds?: boolean;
  calendarProps?: CalendarProps;
  timeInputProps?: TimeInputProps;
  popoverContentClassName?: string;
};

const getTimeValue = (date: Date | undefined, showSeconds: boolean) => {
  if (!date) {
    return "";
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
};

const applyTime = (date: Date, time: string) => {
  const [hours = "0", minutes = "0", seconds = "0"] = time.split(":");
  const next = new Date(date);

  next.setHours(
    Number.parseInt(hours, 10) || 0,
    Number.parseInt(minutes, 10) || 0,
    Number.parseInt(seconds, 10) || 0,
    0,
  );

  return next;
};

function DateTimePicker(props: DateTimePickerProps) {
  const {
    value,
    defaultValue,
    onChange,
    placeholder = "Pick a date and time",
    displayFormat = "PPP p",
    timeLabel = "Time",
    showSeconds = false,
    calendarProps,
    timeInputProps,
    popoverContentClassName,
    className,
    disabled,
    children,
    ...buttonProps
  } = props;
  const isControlled = Object.hasOwn(props, "value");
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selected = isControlled ? value : internalValue;
  const timeInputId = React.useId();
  const {
    className: timeInputClassName,
    id: providedTimeInputId,
    ...timeInputAttributes
  } = timeInputProps ?? {};
  const inputId = providedTimeInputId ?? timeInputId;

  const setSelected = React.useCallback(
    (next: Date | undefined) => {
      if (!isControlled) {
        setInternalValue(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelected(undefined);
      return;
    }

    setSelected(applyTime(date, getTimeValue(selected, showSeconds)));
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;

    if (!time) {
      return;
    }

    setSelected(applyTime(selected ?? new Date(), time));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
          variant="outline"
          {...buttonProps}
        >
          <CalendarIcon data-icon="inline-start" />
          {children ??
            (selected ? (
              format(selected, displayFormat)
            ) : (
              <span>{placeholder}</span>
            ))}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-auto p-0", popoverContentClassName)}
      >
        <div className="divide-y overflow-hidden rounded-lg bg-background">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateSelect}
            {...calendarProps}
          />
          <div className="space-y-2 p-3">
            <Label htmlFor={inputId}>{timeLabel}</Label>
            <Input
              id={inputId}
              type="time"
              step={showSeconds ? 1 : 60}
              value={getTimeValue(selected, showSeconds)}
              onChange={handleTimeChange}
              className={timeInputClassName}
              {...timeInputAttributes}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };
