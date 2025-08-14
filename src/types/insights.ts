export interface ParkingTrendPoint {
  timestamp: string; // ISO timestamp or date string
  occupancy?: number; // % or 0-1 depending on API
  free?: number; // count of free bays
  zone?: string | null;
}

export interface PopulationTrendPoint {
  year: number;
  population: number;
}

export interface MotorCensusPoint {
  year: number;
  vehicles: number;
}

export interface ZoneStat {
  zone: string;
  bays: number;
}
