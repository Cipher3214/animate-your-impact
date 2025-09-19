// Carbon Footprint Calculator Types

export enum AnimationState {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface TransportMode {
  id: string;
  name: string;
  icon: string;
  emissionFactor: number; // kg CO2 per km
}

export interface HomeType {
  id: string;
  name: string;
  area: number; // square feet
  energyFactor: number; // energy consumption multiplier
}

export interface CarbonData {
  transport: {
    selectedModes: string[];
    dailyKm: number;
    modeDistribution: Record<string, number>; // percentage split
  };
  home: {
    type: string;
    occupants: number;
    hasSolar: boolean;
    solarPercentage: number;
  };
  cooling: {
    type: 'fan' | 'cooler' | 'ac-few' | 'ac-most';
  };
  shopping: {
    source: 'local' | 'quick-commerce' | 'supermarket';
    reusableBags: boolean;
  };
}

export interface AnimationTiers {
  transport: AnimationState;
  home: AnimationState;
  cooling: AnimationState;
  shopping: AnimationState;
  solar: AnimationState;
}

export interface QuestionConfig {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single' | 'multiple' | 'slider' | 'toggle';
  options?: Array<{
    id: string;
    label: string;
    icon?: string;
    image?: string;
  }>;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}