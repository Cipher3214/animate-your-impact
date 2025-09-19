import { CarbonCalculator } from '@/components/CarbonCalculator';
import { CarbonData } from '@/types/carbonCalculator';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const handleCalculatorComplete = (data: CarbonData, score: number) => {
    toast({
      title: "Assessment Complete!",
      description: `Your carbon footprint: ${score} kg CO₂/day`,
    });
    
    // Here you could save the data to a database or analytics service
    console.log('Carbon footprint data:', data, 'Score:', score);
  };

  return (
    <div className="min-h-screen">
      <CarbonCalculator onComplete={handleCalculatorComplete} />
    </div>
  );
};

export default Index;
