import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Coins, ShoppingCart, Dna, ChevronRight, ChevronLeft } from 'lucide-react';

const onboardingSteps = [
  {
    icon: Wallet,
    title: 'Track Your Portfolio',
    description: 'View all your Fyre PureBreed holdings, total values, and performance in one place.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Coins,
    title: 'Pre-Assets & Collectibles',
    description: 'Manage your Casts, Enzymes, Oocytes, and other pre-snapshot assets.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: ShoppingCart,
    title: 'QuickBuy & MultiBuy',
    description: 'Instantly purchase multiple species tokens with our streamlined buying tools.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Dna,
    title: 'DNA Gifting',
    description: 'Send DNA tokens to friends, track your gifting history, and climb the leaderboard.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

export function OnboardingPortfolio() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/portfolio');
    }
  };

  const handleSkip = () => {
    navigate('/portfolio');
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
