import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Leaf, ArrowLeft, ArrowRight } from 'lucide-react';
import { CarbonData, AnimationTiers, AnimationState } from '@/types/carbonCalculator';
import { calculateTransportTier, calculateHomeTier, calculateSolarTier, calculateCoolingTier, calculateShoppingTier, calculateCarbonScore } from '@/utils/carbonTiers';
import { TransportQuestion } from './questions/TransportQuestion';
import { HomeQuestion } from './questions/HomeQuestion';
import { SolarQuestion } from './questions/SolarQuestion';
import { CoolingQuestion } from './questions/CoolingQuestion';
import { ShoppingQuestion } from './questions/ShoppingQuestion';
import { ResultsScreen } from './ResultsScreen';

interface CarbonCalculatorProps {
  onComplete?: (data: CarbonData, score: number) => void;
}

const TOTAL_QUESTIONS = 5;

export const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [carbonData, setCarbonData] = useState<CarbonData>({
    transport: {
      selectedModes: [],
      dailyKm: 10,
      modeDistribution: {},
    },
    home: {
      type: '2bhk',
      occupants: 3,
      hasSolar: false,
      solarPercentage: 0,
    },
    cooling: {
      type: 'ac-few',
    },
    shopping: {
      source: 'quick-commerce',
      reusableBags: false,
    },
  });

  const [animationTiers, setAnimationTiers] = useState<AnimationTiers>({
    transport: AnimationState.MEDIUM,
    home: AnimationState.MEDIUM,
    cooling: AnimationState.MEDIUM,
    shopping: AnimationState.MEDIUM,
    solar: AnimationState.HIGH,
  });

  const updateAnimationTiers = useCallback((newData: CarbonData) => {
    const newTiers: AnimationTiers = {
      transport: calculateTransportTier(newData.transport.dailyKm, newData.transport.selectedModes),
      home: calculateHomeTier(newData.home.type, newData.home.occupants),
      solar: calculateSolarTier(newData.home.solarPercentage),
      cooling: calculateCoolingTier(newData.cooling.type),
      shopping: calculateShoppingTier(newData.shopping.source, newData.shopping.reusableBags),
    };
    
    setAnimationTiers(newTiers);
  }, []);

  const updateCarbonData = useCallback((updates: Partial<CarbonData>) => {
    setCarbonData(prev => {
      const newData = { ...prev, ...updates };
      updateAnimationTiers(newData);
      return newData;
    });
  }, [updateAnimationTiers]);

  const handleNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const score = calculateCarbonScore(carbonData);
      onComplete?.(carbonData, score);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / (TOTAL_QUESTIONS + 1)) * 100;
  const carbonScore = calculateCarbonScore(carbonData);

  const renderQuestion = () => {
    switch (currentQuestion) {
      case 0:
        return (
          <TransportQuestion
            data={carbonData.transport}
            animationTier={animationTiers.transport}
            onChange={(transport) => updateCarbonData({ transport })}
          />
        );
      case 1:
        return (
          <HomeQuestion
            data={carbonData.home}
            animationTier={animationTiers.home}
            onChange={(home) => updateCarbonData({ home })}
          />
        );
      case 2:
        return (
          <SolarQuestion
            hasSolar={carbonData.home.hasSolar}
            solarPercentage={carbonData.home.solarPercentage}
            animationTier={animationTiers.solar}
            onChange={(hasSolar, solarPercentage) => 
              updateCarbonData({ 
                home: { ...carbonData.home, hasSolar, solarPercentage } 
              })
            }
          />
        );
      case 3:
        return (
          <CoolingQuestion
            coolingType={carbonData.cooling.type}
            animationTier={animationTiers.cooling}
            onChange={(type) => updateCarbonData({ cooling: { type } })}
          />
        );
      case 4:
        return (
          <ShoppingQuestion
            source={carbonData.shopping.source}
            reusableBags={carbonData.shopping.reusableBags}
            animationTier={animationTiers.shopping}
            onChange={(source, reusableBags) => 
              updateCarbonData({ shopping: { source, reusableBags } })
            }
          />
        );
      case 5:
        return (
          <ResultsScreen
            carbonData={carbonData}
            carbonScore={carbonScore}
            animationTiers={animationTiers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Carbon Footprint Calculator
          </h1>
          <p className="text-muted-foreground">
            Discover your environmental impact with real-time visualizations
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-8 eco-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {TOTAL_QUESTIONS + 1}
            </span>
            <span className="text-sm font-medium text-primary">
              Current Score: {carbonScore} kg CO₂/day
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Question Content */}
        <div className="mb-8">
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-primary"
          >
            {currentQuestion === TOTAL_QUESTIONS ? 'View Results' : 'Next'}
            {currentQuestion !== TOTAL_QUESTIONS && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};