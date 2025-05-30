/**
 * Animation Validation Page for Yunnan Taste Mini-Program
 * Tests and demonstrates all animation components in the Bioluminescent Forest theme
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { styled } from 'styled-components';

// Import all animation components
import {
  TransitionProvider,
  usePageTransition,
  TransitionType,
  FadeIn,
  Parallax,
  StaggeredContainer,
  StaggeredItem,
  GlowContainer,
  ParticleBackground,
  Button,
  Card,
  Toggle,
  Input,
  LoadingSpinner,
  Skeleton,
  SkeletonList,
  SkeletonCard,
  SuccessIndicator,
  ErrorIndicator,
  EmptyState,
  AnimationValidation
} from '@/animations/animations';

// Styled components
const PageContainer = styled(ScrollView)`
  background-color: var(--color-background);
  min-height: 100vh;
`;

const Section = styled(View)`
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
`;

const SectionTitle = styled(Text)`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-textPrimary);
  margin-bottom: var(--spacing-md);
  display: block;
`;

const SectionDescription = styled(Text)`
  font-size: var(--font-size-md);
  color: var(--color-textSecondary);
  margin-bottom: var(--spacing-lg);
  display: block;
`;

const ComponentRow = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ComponentColumn = styled(View)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ComponentLabel = styled(Text)`
  font-size: var(--font-size-sm);
  color: var(--color-textSecondary);
  margin-bottom: var(--spacing-xs);
  display: block;
`;

const ValidationCard = styled(View)`
  background-color: var(--color-backgroundAlt);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const ValidationTitle = styled(Text)`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-textPrimary);
  margin-bottom: var(--spacing-xs);
  display: block;
`;

const ValidationResult = styled(Text)<{ $success: boolean }>`
  font-size: var(--font-size-sm);
  color: ${props => props.$success ? 'var(--color-success)' : 'var(--color-error)'};
  display: block;
`;

const ValidationPage: React.FC = () => {
  const { startTransition } = usePageTransition();
  const [validationResults, setValidationResults] = useState<{
    [key: string]: { success: boolean; message: string }
  }>({});
  
  // State for interactive components
  const [toggleState, setToggleState] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  // Run validation tests
  useEffect(() => {
    const runValidations = async () => {
      const results: { [key: string]: { success: boolean; message: string } } = {};
      
      // Test animation performance
      try {
        const shouldEnableAnimations = AnimationValidation.shouldEnableAnimations();
        results.devicePerformance = {
          success: true,
          message: shouldEnableAnimations 
            ? 'Device supports animations' 
            : 'Device has limited animation support'
        };
      } catch (error) {
        results.devicePerformance = {
          success: false,
          message: 'Failed to check device performance'
        };
      }
      
      // Test reduced motion preference
      try {
        const prefersReducedMotion = AnimationValidation.prefersReducedMotion();
        results.reducedMotion = {
          success: true,
          message: prefersReducedMotion 
            ? 'Reduced motion is preferred' 
            : 'Full animations are preferred'
        };
      } catch (error) {
        results.reducedMotion = {
          success: false,
          message: 'Failed to check reduced motion preference'
        };
      }
      
      // Test page transitions
      try {
        const transitionPerf = AnimationValidation.logPerformance('Page Transition');
        startTransition(TransitionType.FADE, { direction: 'in' });
        setTimeout(() => {
          const duration = transitionPerf.end();
          results.pageTransitions = {
            success: duration < 1000,
            message: `Page transition completed in ${duration}ms`
          };
          setValidationResults(prev => ({ ...prev, pageTransitions: results.pageTransitions }));
        }, 600);
      } catch (error) {
        results.pageTransitions = {
          success: false,
          message: 'Failed to test page transitions'
        };
      }
      
      // Set initial results
      setValidationResults(results);
    };
    
    runValidations();
  }, [startTransition]);
  
  return (
    <PageContainer>
      <Section>
        <SectionTitle>Animation Validation</SectionTitle>
        <SectionDescription>
          This page tests and demonstrates all animation components in the Bioluminescent Forest theme.
        </SectionDescription>
        
        <ComponentColumn>
          {Object.entries(validationResults).map(([key, result]) => (
            <ValidationCard key={key}>
              <ValidationTitle>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</ValidationTitle>
              <ValidationResult $success={result.success}>
                {result.message}
              </ValidationResult>
            </ValidationCard>
          ))}
        </ComponentColumn>
      </Section>
      
      <Section>
        <SectionTitle>Page Transitions</SectionTitle>
        <SectionDescription>
          Smooth transitions between pages with bioluminescent effects.
        </SectionDescription>
        
        <ComponentRow>
          <Button 
            onClick={() => startTransition(TransitionType.FADE, { direction: 'in' })}
            variant="primary"
            glow
          >
            Fade Transition
          </Button>
          
          <Button 
            onClick={() => startTransition(TransitionType.REVEAL, { direction: 'in' })}
            variant="secondary"
            glow
          >
            Reveal Transition
          </Button>
          
          <Button 
            onClick={() => startTransition(TransitionType.EXPAND, { direction: 'in' })}
            variant="accent"
            glow
          >
            Expand Transition
          </Button>
          
          <Button 
            onClick={() => startTransition(TransitionType.FOREST_REVEAL, { direction: 'in' })}
            variant="primary"
            glow
          >
            Forest Reveal
          </Button>
          
          <Button 
            onClick={() => startTransition(TransitionType.ENERGY_TRANSFER, { direction: 'in' })}
            variant="secondary"
            glow
          >
            Energy Transfer
          </Button>
        </ComponentRow>
      </Section>
      
      <Section>
        <SectionTitle>Scroll Animations</SectionTitle>
        <SectionDescription>
          Elements that animate as you scroll through the page.
        </SectionDescription>
        
        <ComponentColumn>
          <ComponentLabel>Fade In Animation</ComponentLabel>
          <FadeIn type="fade-up">
            <Card elevation={2}>
              <View style={{ padding: 'var(--spacing-md)' }}>
                <Text>This card fades in from below when scrolled into view.</Text>
              </View>
            </Card>
          </FadeIn>
          
          <ComponentLabel>Parallax Effect</ComponentLabel>
          <Parallax depth={0.3}>
            <Card elevation={4} glowIntensity={0.3}>
              <View style={{ padding: 'var(--spacing-md)', height: '100px' }}>
                <Text>This card moves with a parallax effect as you scroll.</Text>
              </View>
            </Card>
          </Parallax>
          
          <ComponentLabel>Staggered Animation</ComponentLabel>
          <StaggeredContainer staggerDelay={100}>
            {[1, 2, 3].map((item) => (
              <StaggeredItem key={item} index={item - 1} type="fade-left">
                <Card elevation={2} style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <View style={{ padding: 'var(--spacing-md)' }}>
                    <Text>Staggered item {item}</Text>
                  </View>
                </Card>
              </StaggeredItem>
            ))}
          </StaggeredContainer>
          
          <ComponentLabel>Glow Container</ComponentLabel>
          <GlowContainer glowColor="rgba(92, 224, 184, 0.5)" glowIntensity={0.5}>
            <Card elevation={2}>
              <View style={{ padding: 'var(--spacing-md)' }}>
                <Text>This container has a bioluminescent glow effect.</Text>
              </View>
            </Card>
          </GlowContainer>
          
          <ComponentLabel>Particle Background</ComponentLabel>
          <ParticleBackground particleCount={20} particleColor="#5CE0B8">
            <Card elevation={2} style={{ height: '150px' }}>
              <View style={{ padding: 'var(--spacing-md)' }}>
                <Text>This card has a bioluminescent particle background.</Text>
              </View>
            </Card>
          </ParticleBackground>
        </ComponentColumn>
      </Section>
      
      <Section>
        <SectionTitle>Interactive Feedback</SectionTitle>
        <SectionDescription>
          Animations that respond to user interactions.
        </SectionDescription>
        
        <ComponentColumn>
          <ComponentLabel>Buttons with Ripple Effect</ComponentLabel>
          <ComponentRow>
            <Button variant="primary" glow>Primary</Button>
            <Button variant="secondary" glow>Secondary</Button>
            <Button variant="accent" glow>Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </ComponentRow>
          
          <ComponentLabel>Card with Lift Effect</ComponentLabel>
          <Card 
            elevation={2} 
            glowIntensity={0.3} 
            glowColor="rgba(92, 224, 184, 0.5)"
            onClick={() => console.log('Card clicked')}
          >
            <View style={{ padding: 'var(--spacing-md)' }}>
              <Text>This card lifts and glows when pressed.</Text>
            </View>
          </Card>
          
          <ComponentLabel>Toggle with Animation</ComponentLabel>
          <Toggle 
            isActive={toggleState} 
            onChange={(active) => setToggleState(active)} 
          />
          
          <ComponentLabel>Input with Focus Animation</ComponentLabel>
          <Input 
            value={inputValue} 
            onChange={(value) => setInputValue(value)} 
            label="Animated Input" 
          />
        </ComponentColumn>
      </Section>
      
      <Section>
        <SectionTitle>Loading States</SectionTitle>
        <SectionDescription>
          Animated loading indicators and state transitions.
        </SectionDescription>
        
        <ComponentColumn>
          <ComponentLabel>Loading Spinner</ComponentLabel>
          <ComponentRow>
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" text="Loading..." />
            <LoadingSpinner size="lg" />
          </ComponentRow>
          
          <ComponentLabel>Skeleton Loading</ComponentLabel>
          <SkeletonCard 
            hasImage={true}
            hasTitle={true}
            hasDescription={true}
            lines={3}
          />
          
          <ComponentLabel>Success Indicator</ComponentLabel>
          <ComponentRow>
            <Button 
              variant="primary" 
              onClick={() => setShowSuccess(!showSuccess)}
            >
              Toggle Success
            </Button>
            <SuccessIndicator active={showSuccess} />
          </ComponentRow>
          
          <ComponentLabel>Error Indicator</ComponentLabel>
          <ComponentRow>
            <Button 
              variant="accent" 
              onClick={() => setShowError(!showError)}
            >
              Toggle Error
            </Button>
            <ErrorIndicator active={showError} />
          </ComponentRow>
          
          <ComponentLabel>Empty State</ComponentLabel>
          <EmptyState
            title="No items found"
            description="Try adjusting your search or filters to find what you're looking for."
            image={
              <ParticleBackground particleCount={15} particleColor="#5CE0B8">
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '40px'
                }}>
                  🌿
                </View>
              </ParticleBackground>
            }
            action={
              <Button variant="primary" glow>
                Refresh
              </Button>
            }
          />
        </ComponentColumn>
      </Section>
    </PageContainer>
  );
};

export default () => (
  <TransitionProvider>
    <ValidationPage />
  </TransitionProvider>
);
