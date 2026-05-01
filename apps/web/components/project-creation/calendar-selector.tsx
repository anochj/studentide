"use client";

import { useState } from "react";
import { DateTimePicker } from "@/components/ui/date-time";

type CalendarSelectorProps = {
  timeLabel: string;
  onChange?: (value: Date | undefined) => void;
};

export function CalendarSelector({
  timeLabel,
  onChange,
}: CalendarSelectorProps) {
  const [defaultDateTime] = useState(() => {
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

  return (
    <DateTimePicker
      defaultValue={defaultDateTime}
      onChange={onChange}
      timeLabel={timeLabel}
    />
  );
}
