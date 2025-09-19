import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CarbonData, AnimationTiers, AnimationState } from '@/types/carbonCalculator';
import { Leaf, Target, TrendingDown, Share2, RotateCcw } from 'lucide-react';

interface ResultsScreenProps {
  carbonData: CarbonData;
  carbonScore: number;
  animationTiers: AnimationTiers;
  onRestart?: () => void;
}

const AVERAGE_CARBON_FOOTPRINT = 8.5; // kg CO2 per day (India average)

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  carbonData,
  carbonScore,
  animationTiers,
  onRestart,
}) => {
  const percentageOfAverage = Math.round((carbonScore / AVERAGE_CARBON_FOOTPRINT) * 100);
  const isAboveAverage = carbonScore > AVERAGE_CARBON_FOOTPRINT;
  
  const getScoreColor = () => {
    if (carbonScore <= 4) return 'text-success';
    if (carbonScore <= 7) return 'text-eco-medium';
    return 'text-eco-high';
  };

  const getScoreRating = () => {
    if (carbonScore <= 4) return { rating: 'Excellent', icon: '🌟', description: 'You have a very low carbon footprint!' };
    if (carbonScore <= 7) return { rating: 'Good', icon: '🌱', description: 'Your carbon footprint is below average.' };
    if (carbonScore <= 10) return { rating: 'Average', icon: '⚡', description: 'Your carbon footprint is around average.' };
    return { rating: 'High', icon: '🚨', description: 'There\'s room for improvement in your carbon footprint.' };
  };

  const scoreInfo = getScoreRating();

  const getTierBadge = (tier: AnimationState) => {
    const className = tier === AnimationState.LOW ? 'tier-low' : 
                     tier === AnimationState.MEDIUM ? 'tier-medium' : 'tier-high';
    return <Badge className={className}>{tier}</Badge>;
  };

  const recommendations = [
    ...(animationTiers.transport === AnimationState.HIGH ? ['Consider using public transport or cycling more often'] : []),
    ...(animationTiers.home === AnimationState.HIGH ? ['Optimize home energy usage or consider shared living'] : []),
    ...(animationTiers.solar === AnimationState.HIGH ? ['Installing solar panels can significantly reduce your footprint'] : []),
    ...(animationTiers.cooling === AnimationState.HIGH ? ['Use fans more and AC less, or upgrade to energy-efficient units'] : []),
    ...(animationTiers.shopping === AnimationState.HIGH ? ['Shop locally and use reusable bags'] : []),
  ];

  return (
    <div className="space-y-6 slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4">
          <Leaf className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Your Carbon Footprint Results
        </h2>
        <p className="text-muted-foreground">
          Here's your personalized environmental impact analysis
        </p>
      </div>

      {/* Main Score Card */}
      <Card className="p-8 text-center bg-gradient-to-r from-background to-secondary/10 eco-glow">
        <div className="space-y-4">
          <div className="text-6xl mb-2">{scoreInfo.icon}</div>
          <div>
            <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
              {carbonScore}
            </div>
            <div className="text-sm text-muted-foreground mb-1">kg CO₂ per day</div>
            <Badge className={getScoreColor().replace('text-', 'bg-').replace('bg-', 'bg-') + '/10 ' + getScoreColor()}>
              {scoreInfo.rating}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {scoreInfo.description}
          </p>
          
          {/* Comparison with Average */}
          <div className="bg-card/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Compared to India Average ({AVERAGE_CARBON_FOOTPRINT} kg CO₂/day)</span>
              <span className={`text-sm font-medium ${isAboveAverage ? 'text-eco-high' : 'text-success'}`}>
                {percentageOfAverage}%
              </span>
            </div>
            <Progress value={percentageOfAverage > 100 ? 100 : percentageOfAverage} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Impact Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Transport</span>
              {getTierBadge(animationTiers.transport)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Home Efficiency</span>
              {getTierBadge(animationTiers.home)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Solar Usage</span>
              {getTierBadge(animationTiers.solar)}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cooling</span>
              {getTierBadge(animationTiers.cooling)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Shopping</span>
              {getTierBadge(animationTiers.shopping)}
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-success" />
            Recommendations to Reduce Impact
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-success/5 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onRestart}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Assessment
        </Button>
        <Button className="flex items-center gap-2 bg-gradient-primary">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </div>

      {/* Fun Fact */}
      <Card className="p-6 bg-gradient-to-r from-accent/5 to-primary/5">
        <div className="text-center">
          <div className="text-2xl mb-2">🌍</div>
          <h4 className="font-semibold text-foreground mb-2">Did you know?</h4>
          <p className="text-sm text-muted-foreground">
            If everyone lived like you, we would need{' '}
            <span className="font-semibold text-foreground">
              {(carbonScore / 4.5).toFixed(1)} Earths
            </span>{' '}
            to sustain our lifestyle. Small changes can make a big difference!
          </p>
        </div>
      </Card>
    </div>
  );
};