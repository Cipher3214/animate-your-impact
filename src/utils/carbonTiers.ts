import { AnimationState, CarbonData } from '@/types/carbonCalculator';

// Tier calculation functions
export const getTier = (value: number, lowThreshold: number, highThreshold: number): AnimationState => {
  if (value <= lowThreshold) return AnimationState.LOW;
  if (value <= highThreshold) return AnimationState.MEDIUM;
  return AnimationState.HIGH;
};

export const calculateTransportTier = (dailyKm: number, selectedModes: string[]): AnimationState => {
  // Walking/cycling reduces tier
  const hasEcoTransport = selectedModes.includes('walk') || selectedModes.includes('cycle');
  const adjustedKm = hasEcoTransport ? dailyKm * 0.7 : dailyKm;
  
  return getTier(adjustedKm, 10, 35);
};

export const calculateHomeTier = (homeType: string, occupants: number): AnimationState => {
  const areaMap: Record<string, number> = {
    '1rk': 200,
    '1bhk': 400,
    '2bhk': 800,
    '3bhk': 1200,
    'villa': 2000,
  };
  
  const area = areaMap[homeType] || 600;
  const areaPerPerson = area / occupants;
  
  return getTier(areaPerPerson, 200, 500);
};

export const calculateSolarTier = (solarPercentage: number): AnimationState => {
  // Inverted tier - more solar = lower emissions
  if (solarPercentage >= 60) return AnimationState.LOW;
  if (solarPercentage >= 25) return AnimationState.MEDIUM;
  return AnimationState.HIGH;
};

export const calculateCoolingTier = (coolingType: string): AnimationState => {
  const coolingMap: Record<string, AnimationState> = {
    'fan': AnimationState.LOW,
    'cooler': AnimationState.MEDIUM,
    'ac-few': AnimationState.MEDIUM,
    'ac-most': AnimationState.HIGH,
  };
  
  return coolingMap[coolingType] || AnimationState.MEDIUM;
};

export const calculateShoppingTier = (source: string, reusableBags: boolean): AnimationState => {
  let tier: AnimationState;
  
  switch (source) {
    case 'local':
      tier = AnimationState.LOW;
      break;
    case 'quick-commerce':
      tier = AnimationState.MEDIUM;
      break;
    case 'supermarket':
      tier = AnimationState.HIGH;
      break;
    default:
      tier = AnimationState.MEDIUM;
  }
  
  // Reduce tier if using reusable bags
  if (reusableBags && tier === AnimationState.HIGH) {
    tier = AnimationState.MEDIUM;
  } else if (reusableBags && tier === AnimationState.MEDIUM) {
    tier = AnimationState.LOW;
  }
  
  return tier;
};

export const calculateCarbonScore = (data: CarbonData): number => {
  // Simplified carbon score calculation (kg CO2 per day)
  let score = 0;
  
  // Transport emissions
  score += data.transport.dailyKm * 0.2; // Average emission factor
  
  // Home emissions (base on type and occupancy)
  const homeMultiplier = data.home.occupants > 0 ? 1 / data.home.occupants : 1;
  score += 5 * homeMultiplier; // Base home emissions
  
  // Solar reduction
  if (data.home.hasSolar) {
    score *= (1 - data.home.solarPercentage / 100);
  }
  
  // Cooling emissions
  const coolingEmissions = {
    'fan': 0.5,
    'cooler': 1.0,
    'ac-few': 2.0,
    'ac-most': 4.0,
  };
  score += coolingEmissions[data.cooling.type] || 1.0;
  
  // Shopping emissions
  const shoppingEmissions = {
    'local': 0.5,
    'quick-commerce': 1.5,
    'supermarket': 2.0,
  };
  let shoppingScore = shoppingEmissions[data.shopping.source] || 1.0;
  if (data.shopping.reusableBags) shoppingScore *= 0.8;
  score += shoppingScore;
  
  return Math.round(score * 10) / 10;
};