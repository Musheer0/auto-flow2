"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EnumLike = Record<string, string>;

interface EnumSelectProps<T extends EnumLike> {
  enums: T;
  value?: T[keyof T];
  onSelect: (value: T[keyof T]) => void;
  placeholder?: string;
  className?: string;
  formatLabel?: (key: keyof T, value: T[keyof T]) => string;
}

export function EnumSelect<T extends EnumLike>({
  enums,
  value,
  onSelect,
  placeholder = "Select...",
  className,
  formatLabel,
}: EnumSelectProps<T>) {
  const entries = Object.entries(enums) as [
    keyof T,
    T[keyof T],
  ][];

  return (
    <Select
      value={value}
      onValueChange={(v) => onSelect(v as T[keyof T])}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {entries.map(([key, val]) => (
          <SelectItem key={String(key)} value={val}>
            {formatLabel
              ? formatLabel(key, val)
              : String(key)
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}