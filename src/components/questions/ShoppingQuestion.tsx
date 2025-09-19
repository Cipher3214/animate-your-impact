import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AnimationState } from '@/types/carbonCalculator';
import { ShoppingCart, Truck, Store, Leaf } from 'lucide-react';

interface ShoppingQuestionProps {
  source: 'local' | 'quick-commerce' | 'supermarket';
  reusableBags: boolean;
  animationTier: AnimationState;
  onChange: (source: 'local' | 'quick-commerce' | 'supermarket', reusableBags: boolean) => void;
}

const SHOPPING_OPTIONS = [
  {
    id: 'local' as const,
    name: 'Local Vendors / Sabzi Mandi',
    icon: Store,
    description: 'Seasonal, minimal packaging',
    packaging: 'Minimal',
    color: 'text-success',
  },
  {
    id: 'quick-commerce' as const,
    name: 'Quick Commerce (Zepto/Blinkit)',
    icon: Truck,
    description: 'Fast delivery, moderate packaging',
    packaging: 'Medium',
    color: 'text-eco-medium',
  },
  {
    id: 'supermarket' as const,
    name: 'Large Supermarkets',
    icon: ShoppingCart,
    description: 'Pre-packaged goods',
    packaging: 'High',
    color: 'text-eco-high',
  },
];

export const ShoppingQuestion: React.FC<ShoppingQuestionProps> = ({
  source,
  reusableBags,
  animationTier,
  onChange,
}) => {
  const selectedOption = SHOPPING_OPTIONS.find(opt => opt.id === source);
  
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
    <div className="space-y-6 slide-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Grocery Shopping Style
        </h2>
        <p className="text-muted-foreground">
          How do you usually shop for groceries?
        </p>
      </div>

      {/* Shopping Source Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SHOPPING_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className={`transport-tile ${
                source === option.id ? 'selected' : ''
              }`}
              onClick={() => onChange(option.id, reusableBags)}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  {option.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {option.description}
                </p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${option.color}`}
                >
                  {option.packaging} Packaging
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Reusable Bags Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Bring Reusable Bags
              </h3>
              <p className="text-sm text-muted-foreground">
                Reduce plastic bag usage
              </p>
            </div>
          </div>
          <Switch
            checked={reusableBags}
            onCheckedChange={(checked) => onChange(source, checked)}
          />
        </div>
      </Card>

      {/* Shopping Impact Visualization */}
      <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getTierClassName(animationTier)} pulse-eco`}>
            {selectedOption && (
              <selectedOption.icon 
                className={`w-8 h-8 ${selectedOption.color}`} 
              />
            )}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Shopping Impact: {animationTier}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Packaging Level</p>
              <p className={`text-lg font-semibold ${selectedOption?.color}`}>
                {selectedOption?.packaging}
              </p>
            </div>
            <div className="bg-card/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Bag Type</p>
              <p className={`text-lg font-semibold ${reusableBags ? 'text-success' : 'text-eco-high'}`}>
                {reusableBags ? 'Reusable' : 'Disposable'}
              </p>
            </div>
          </div>

          {/* Shopping Method Visualization */}
          <div className="mt-4 space-y-2">
            {source === 'local' && (
              <div className="flex justify-center items-center gap-2">
                <Store className="w-5 h-5 text-success" />
                <div className="text-sm font-medium text-success">
                  Fresh & Local ✨
                </div>
              </div>
            )}
            
            {reusableBags && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <Leaf className="w-4 h-4 text-success animate-float" />
                <span className="text-sm text-success font-medium">
                  Eco-friendly choice!
                </span>
              </div>
            )}

            {/* Packaging waste visualization */}
            <div className="mt-3">
              <div className="flex justify-center gap-1">
                {[...Array(source === 'local' ? 1 : source === 'quick-commerce' ? 2 : 3)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-6 rounded ${
                      reusableBags ? 'bg-success/30' : 'bg-eco-high/50'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Packaging waste level
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {animationTier === AnimationState.LOW && '🌱 Fantastic! You\'re shopping sustainably with minimal waste.'}
            {animationTier === AnimationState.MEDIUM && '♻️ Good balance - consider using more reusable options.'}
            {animationTier === AnimationState.HIGH && '📦 High packaging impact - try local markets and reusable bags!'}
          </p>
        </div>
      </Card>
    </div>
  );
};