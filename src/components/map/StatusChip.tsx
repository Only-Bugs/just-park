// src/components/map/StatusChip.tsx
import { Chip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

export type ChipVariant =
  | "closest"
  | "economical"
  | "available"
  | "occupied"
  | "custom";

interface StatusChipProps {
  variant: ChipVariant;
  label?: string;
  customColor?: string;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
}

const chipConfigs = {
  closest: {
    label: "Closest",
    color: "#1976d2",
    textColor: "white",
  },
  economical: {
    label: "Economical",
    color: "#22c55e",
    textColor: "white",
  },
  available: {
    label: "Available",
    color: "#22c55e",
    textColor: "white",
  },
  occupied: {
    label: "Occupied",
    color: "#ef4444",
    textColor: "white",
  },
  custom: {
    label: "Custom",
    color: "#666",
    textColor: "white",
  },
};

export default function StatusChip({
  variant,
  label,
  customColor,
  size = "small",
  sx = {},
}: StatusChipProps) {
  const config = chipConfigs[variant];
  const chipLabel = label || config.label;
  const chipColor = customColor || config.color;

  return (
    <Chip
      label={chipLabel}
      size={size}
      sx={{
        bgcolor: chipColor,
        color: config.textColor,
        fontWeight: 600,
        fontSize: size === "small" ? "0.7rem" : "0.8rem",
        height: size === "small" ? 24 : 28,
        px: 1,
        boxShadow: `0 2px 8px ${chipColor}30`,
        ...sx,
      }}
    />
  );
}
