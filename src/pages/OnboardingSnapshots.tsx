import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Crown, Gift, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Clock,
    title: 'Snapshot Events',
    description: 'Weekly blockchain snapshots determine who becomes the Custodian of each species.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Crown,
    title: 'Become a Custodian',
    description: 'Hold the most tokens of a species when a snapshot occurs to earn custody rights.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Gift,
    title: 'BlindBox Hints',
    description: 'Unlock hints about upcoming snapshots with our mystery BlindBox system.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Syndicate Rewards',
    description: 'Track profitable purebreeds, breeder communities, and earn from hybrid creations.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export function OnboardingSnapshots() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/snapshots');
    }
  };

  const handleSkip = () => {
    navigate('/snapshots');
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center px-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {onboardingSteps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>

      {/* Icon */}
      <div className={`p-6 rounded-full ${step.bgColor} mb-8 animate-fade-in`}>
        <Icon className={`h-16 w-16 ${step.color}`} />
      </div>

      {/* Content */}
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-4">{step.title}</h1>
        <p className="text-muted-foreground mb-12">{step.description}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 w-full max-w-xs">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleNext}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Skip button */}
      <Button
        variant="link"
        onClick={handleSkip}
        className="mt-4 text-muted-foreground"
      >
        Skip intro
      </Button>
    </div>
  );
}
