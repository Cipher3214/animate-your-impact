import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AnimationState } from '@/types/carbonCalculator';
import { Sun, Zap } from 'lucide-react';
import { PageTransition } from '@/components/animations/PageTransition';

interface SolarQuestionProps {
  hasSolar: boolean;
  solarPercentage: number;
  animationTier: AnimationState;
  onChange: (hasSolar: boolean, solarPercentage: number) => void;
}

export const SolarQuestion: React.FC<SolarQuestionProps> = ({
  hasSolar,
  solarPercentage,
  animationTier,
  onChange,
}) => {
  const getTierClassName = (tier: AnimationState) => {
    switch (tier) {
      case AnimationState.LOW:
        return 'tier-low';
      case AnimationState.MEDIUM:
        return 'tier-medium';
      case AnimationState.HIGH:
        return 'tier-high';
      default:
        return '';
    }
  };

  return (
    <PageTransition backgroundType="solar" animationTier={animationTier}>
      <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Solar Energy Usage
        </h2>
        <p className="text-muted-foreground">
          Do you use solar panels for electricity?
        </p>
      </div>

      {/* Solar Panel Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Sun className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Solar Panels Installed
              </h3>
              <p className="text-sm text-muted-foreground">
                Generate clean energy at home
              </p>
            </div>
          </div>
          <Switch
            checked={hasSolar}
            onCheckedChange={(checked) => onChange(checked, checked ? 25 : 0)}
          />
        </div>
      </Card>

      {/* Solar Percentage Slider (only shown if solar is enabled) */}
      {hasSolar && (
        <Card className="p-6 float-gentle">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Electricity from Solar
              </label>
              <Badge className={getTierClassName(animationTier)}>
                {solarPercentage}% - {animationTier}
              </Badge>
            </div>
            <Slider
              value={[solarPercentage]}
              onValueChange={([value]) => onChange(hasSolar, value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </Card>
      )}

      {/* Solar Impact Visualization */}
      <Card className="p-8 bg-gradient-to-r from-accent/10 to-success/10">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getTierClassName(animationTier)} pulse-eco`}>
            {hasSolar ? (
              <Sun className="w-8 h-8 animate-float" />
            ) : (
              <Zap className="w-8 h-8" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Energy Impact: {animationTier}
          </h3>
          
          {hasSolar ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Clean Energy</p>
                  <p className="text-lg font-semibold text-success">
                    {solarPercentage}%
                  </p>
                </div>
                <div className="bg-card/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Grid Energy</p>
                  <p className="text-lg font-semibold text-foreground">
                    {100 - solarPercentage}%
                  </p>
                </div>
              </div>
              
              {/* Solar Panel Animation */}
              <div className="bg-gradient-to-r from-yellow-200 to-orange-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 pulse-eco"
                  style={{ width: `${solarPercentage}%` }}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                {animationTier === AnimationState.LOW && '🌟 Amazing! You\'re generating most of your electricity cleanly!'}
                {animationTier === AnimationState.MEDIUM && '☀️ Great progress with solar energy adoption!'}
                {animationTier === AnimationState.HIGH && '🔋 Every bit of solar helps - consider expanding your setup!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Currently using grid electricity only
              </p>
              <div className="bg-gradient-warning h-2 rounded-full" />
              <p className="text-sm text-muted-foreground">
                💡 Consider installing solar panels to reduce your carbon footprint!
              </p>
            </div>
          )}
        </div>
      </Card>
      </div>
    </PageTransition>
  );
};