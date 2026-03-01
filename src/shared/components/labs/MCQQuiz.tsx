import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type Props = {
  questionsData: Question[];
  duration?: number;
};

const POINTS_PER_QUESTION = 5;

export default function MCQQuiz({ questionsData, duration = 60 }: Props) {
  const navigate = useNavigate();
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [timer, setTimer] = useState(duration);
  const [submitted, setSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Timer with warning
  useEffect(() => {
    if (submitted) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 10 && prev > 0) {
          setShowWarning(true);
        }
        if (prev <= 0) {
          clearInterval(interval);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (submitted) return;

      const currentOptions = questionsData[currentQuestion].options;

      // Number keys 1-4 for options
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (index < currentOptions.length) {
          setSelectedAnswers({
            ...selectedAnswers,
            [questionsData[currentQuestion].id]: currentOptions[index],
          });

          // Animate selected option
          optionsRef.current[index]?.classList.add('scale-95');
          setTimeout(() => {
            optionsRef.current[index]?.classList.remove('scale-95');
          }, 100);
        }
      }

      // Enter key for next/submit
      if (e.key === 'Enter') {
        if (currentQuestion < totalQuestions - 1) {
          if (selectedAnswers[questionsData[currentQuestion].id]) {
            handleNext();
          }
        } else {
          if (selectedAnswers[questionsData[currentQuestion].id]) {
            handleSubmit();
          }
        }
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowLeft' && currentQuestion > 0) {
        handlePrevious();
      }
      if (e.key === 'ArrowRight' && currentQuestion < totalQuestions - 1) {
        if (selectedAnswers[questionsData[currentQuestion].id]) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, selectedAnswers, submitted]);

  useEffect(() => {
    if (timer <= 0 && !submitted) {
      handleSubmit(true);
    }
  }, [timer]);

  const computeScore = () => {
    return questionsData.reduce((acc, q) => {
      if (selectedAnswers[q.id] === q.answer) {
        return acc + POINTS_PER_QUESTION;
      }
      return acc;
    }, 0);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
    setShowWarning(false);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => prev - 1);
    setShowWarning(false);
  };

  const handleSubmit = (force = false) => {
    if (submitted) return;

    const currentId = questionsData[currentQuestion].id;
    if (!selectedAnswers[currentId] && !force) return;

    const finalScore = computeScore();
    setSubmitted(true);

    navigate('/temp/quiz-result', {
      state: {
        score: finalScore,
        answers: selectedAnswers,
        questions: questionsData,
        pointsPerQuestion: POINTS_PER_QUESTION,
      },
    });
  };

  const current = questionsData[currentQuestion];
  const totalQuestions = questionsData.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Circular Timer
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const timerProgress = timer / duration;
  const strokeDashoffset = circumference - timerProgress * circumference;

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timer <= 10) return 'stroke-destructive';
    if (timer <= 30) return 'stroke-warning';
    return 'stroke-primary';
  };

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4 md:p-6'>
      <Card className='w-full max-w-3xl rounded-2xl shadow-xl border-2 border-border'>
        {/* Header with progress and timer */}
        <CardHeader className='border-b border-border pb-4 md:pb-6'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='space-y-1'>
              <CardTitle className='text-xl md:text-2xl font-bold'>
                Question {currentQuestion + 1} of {totalQuestions}
              </CardTitle>
              <p className='text-sm text-muted-foreground'>
                {answeredCount} of {totalQuestions} answered •{' '}
                {totalQuestions - answeredCount} remaining
              </p>
            </div>

            {/* Timer circle */}
            <div className='flex items-center gap-4'>
              <div className='relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center'>
                <svg className='transform -rotate-90 w-full h-full'>
                  {/* Background circle */}
                  <circle
                    stroke='hsl(var(--muted))'
                    fill='transparent'
                    strokeWidth='6'
                    r={radius}
                    cx='50%'
                    cy='50%'
                  />
                  {/* Progress circle */}
                  <circle
                    className={cn(
                      'transition-all duration-1000 ease-linear',
                      getTimerColor(),
                    )}
                    fill='transparent'
                    strokeWidth='6'
                    strokeLinecap='round'
                    r={radius}
                    cx='50%'
                    cy='50%'
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <span
                  className={cn(
                    'absolute font-bold text-xl md:text-2xl transition-colors',
                    timer <= 10
                      ? 'text-destructive'
                      : timer <= 30
                        ? 'text-warning'
                        : 'text-foreground',
                  )}>
                  {timer}s
                </span>
              </div>

              {/* Warning message */}
              {showWarning && (
                <div className='text-destructive text-sm font-medium animate-pulse'>
                  ⚡ Time running out!
                </div>
              )}
            </div>
          </div>

          {/* Progress bar with counter */}
          <div className='space-y-2 mt-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Progress</span>
              <span className='font-medium'>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className='h-2' />
          </div>
        </CardHeader>

        <CardContent className='space-y-6 pt-6'>
          {/* Question with decorative element */}
          <div className='relative'>
            <div className='absolute -left-2 top-0 w-1 h-full bg-primary rounded-full' />
            <h2 className='text-lg md:text-xl font-semibold pl-4 leading-relaxed'>
              {current.question}
            </h2>
          </div>

          {/* Options grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {current.options.map((option, idx) => {
              const isSelected = selectedAnswers[current.id] === option;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    optionsRef.current[idx] = el;
                  }}
                  onClick={() =>
                    !submitted &&
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [current.id]: option,
                    })
                  }
                  className={cn(
                    'group relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
                    'hover:shadow-md hover:border-primary/50',
                    'focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:bg-muted/50',
                    submitted && 'opacity-50 cursor-not-allowed',
                  )}
                  role='radio'
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedAnswers({
                        ...selectedAnswers,
                        [current.id]: option,
                      });
                    }
                  }}>
                  <div className='flex items-center gap-3'>
                    <span
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/20',
                      )}>
                      {optionLetter}
                    </span>
                    <span className='flex-1'>{option}</span>
                    {isSelected && (
                      <svg
                        className='w-5 h-5 text-primary'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={3}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className='flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t border-border'>
            <Button
              variant='outline'
              disabled={currentQuestion === 0 || submitted}
              onClick={handlePrevious}
              className='gap-2 order-2 sm:order-1'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Previous
            </Button>

            <div className='flex gap-2 order-1 sm:order-2'>
              {currentQuestion < totalQuestions - 1 ? (
                <Button
                  disabled={!selectedAnswers[current.id] || submitted}
                  onClick={handleNext}
                  className='gap-2 flex-1 sm:flex-none'>
                  Next
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Button>
              ) : (
                <Button
                  disabled={!selectedAnswers[current.id] || submitted}
                  onClick={() => handleSubmit()}
                  className='gap-2 flex-1 sm:flex-none'
                  variant={
                    answeredCount === totalQuestions ? 'default' : 'outline'
                  }>
                  Submit Quiz
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className='text-xs text-muted-foreground/70 text-center border-t border-border pt-4'>
            <span className='inline-flex items-center gap-3'>
              <span>⌨️ 1-{current.options.length} to select</span>
              <span className='w-1 h-1 rounded-full bg-muted-foreground/30' />
              <span>← → to navigate</span>
              <span className='w-1 h-1 rounded-full bg-muted-foreground/30' />
              <span>
                ⏎ to {currentQuestion < totalQuestions - 1 ? 'next' : 'submit'}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
