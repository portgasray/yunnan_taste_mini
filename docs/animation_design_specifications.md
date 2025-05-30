# Yunnan Taste Mini-Program Animation Design Specifications

## Page Transitions

### Home → Category Transition
- **Effect**: Reveal transition with bioluminescent trail
- **Technical Approach**: 
  - Current page fades out while emitting particle trail
  - New page slides in from bottom with slight scale effect
  - Particles follow the direction of navigation
- **Duration**: 450ms
- **Easing**: Custom cubic-bezier(0.16, 1, 0.3, 1)
- **Color Palette**: Teal glow (#5CE0B8) with deep blue background (#0A0F1E)

### Category → Product Detail Transition
- **Effect**: Expanding card with focus zoom
- **Technical Approach**: 
  - Selected product card expands to fill screen
  - Background elements fade out
  - Product image maintains position while details slide up
- **Duration**: 500ms
- **Easing**: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Color Palette**: Product card glows with accent color before expanding

### Product Detail → Cart Transition
- **Effect**: Floating addition with particle burst
- **Technical Approach**: 
  - Product thumbnail floats toward cart icon
  - Particle burst effect when reaching cart
  - Cart icon pulses and counter updates with spring animation
- **Duration**: 800ms (total sequence)
- **Easing**: Spring physics with slight bounce

### Search Flow Transitions
- **Effect**: Liquid morphing between states
- **Technical Approach**: 
  - Search bar expands with liquid animation
  - Results fade in with staggered timing
  - Suggestions appear with subtle glow effect
- **Duration**: 350ms
- **Easing**: cubic-bezier(0.22, 1, 0.36, 1)
- **Color Palette**: Search elements pulse with secondary accent (#3D88F2)

## Scroll Animations

### Product Grid Scroll Animation
- **Effect**: Staggered fade and rise
- **Technical Approach**: 
  - Products appear with staggered timing as they enter viewport
  - Subtle scale and opacity change
  - Glow effect intensifies briefly on appearance
- **Duration**: 200ms per item, staggered by 50ms
- **Easing**: cubic-bezier(0, 0, 0.2, 1)
- **Trigger**: 15% into viewport

### Content Section Parallax
- **Effect**: Multi-layer parallax with bioluminescent particles
- **Technical Approach**: 
  - Background moves at 0.5x scroll speed
  - Midground at 0.7x scroll speed
  - Foreground at 1x scroll speed
  - Particles move independently based on position
- **Intensity**: Subtle, maximum 20px offset
- **Easing**: Linear with scroll position

### Hero Banner Animation
- **Effect**: Breathing forest with particle system
- **Technical Approach**: 
  - Background subtle pulse animation (breathing)
  - Floating particles with varied sizes and speeds
  - Glow intensity changes based on scroll position
- **Duration**: Continuous with 4s breathing cycle
- **Particle Behavior**: Random movement with attraction points

### Category Navigation Scroll
- **Effect**: Elastic snap with glow trail
- **Technical Approach**: 
  - Horizontal scroll with momentum and snap points
  - Selected item emits glow trail during scroll
  - Items scale slightly when centered
- **Snap Behavior**: Elastic with 300ms settling time
- **Highlight Effect**: Glow intensity increases on active item

## Interactive Feedback

### Button Press Animation
- **Effect**: Energetic pulse with ripple
- **Technical Approach**: 
  - Scale down to 95% on press
  - Ripple effect emanates from press point
  - Glow intensity increases briefly
  - Return to normal with slight bounce
- **Duration**: 400ms total (down: 100ms, up: 300ms)
- **Easing**: Press: cubic-bezier(0.4, 0, 0.6, 1), Release: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Color Palette**: Ripple uses button's primary color with increased luminosity

### Card Interaction
- **Effect**: Subtle lift and glow
- **Technical Approach**: 
  - Card lifts slightly on hover/press
  - Shadow depth increases
  - Border glow intensifies
  - Subtle particle effect around edges
- **Duration**: 200ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Elevation Change**: 2dp to 8dp

### Toggle and Switch Animation
- **Effect**: Bioluminescent state change
- **Technical Approach**: 
  - Thumb slides with spring physics
  - Track color transitions with glow effect
  - Particle burst on state change
  - Subtle sound effect (optional)
- **Duration**: 300ms
- **Easing**: Spring physics (tension: 200, friction: 20)
- **Color Transition**: Track morphs from muted to accent color

### Form Input Animation
- **Effect**: Focused energy field
- **Technical Approach**: 
  - Border transitions to glow effect on focus
  - Label animates position and scale
  - Subtle particle movement around focused input
  - Character input causes ripple effect
- **Duration**: Focus transition: 250ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Color Palette**: Focus state uses primary accent color (#5CE0B8)

## Loading Animations

### Initial App Loading
- **Effect**: Bioluminescent forest awakening
- **Technical Approach**: 
  - Dark background with emerging particle lights
  - Logo appears with glow effect
  - Environment elements fade in sequentially
  - Transition to home page with forest "awakening"
- **Duration**: 2000ms total sequence
- **Easing**: Varied for different elements
- **Color Progression**: Dark to increasingly luminescent

### Content Loading Skeleton
- **Effect**: Bioluminescent pulse
- **Technical Approach**: 
  - Skeleton screens with shape of expected content
  - Gradient pulse animation moves through elements
  - Subtle particle effects in loading areas
- **Duration**: 1500ms per pulse cycle
- **Easing**: Sine wave for pulse
- **Color Palette**: Dark base with teal-blue gradient pulse

### Processing Action Indicator
- **Effect**: Energetic particle spiral
- **Technical Approach**: 
  - Circular arrangement of particles
  - Particles move in spiral pattern
  - Glow intensity varies with progress
  - Completes with burst effect on success
- **Duration**: Variable based on action
- **Easing**: Linear for consistent motion
- **Color Palette**: Primary theme colors with varying opacity

### Pull to Refresh
- **Effect**: Gathering forest energy
- **Technical Approach**: 
  - Particles gather from edges as user pulls
  - Energy concentrates in central orb
  - Release triggers burst animation
  - Content refreshes with fade transition
- **Duration**: Responsive to pull distance, release animation 800ms
- **Easing**: Tension-based physics simulation
- **Color Palette**: Increasing luminosity with pull distance

## Micro-interactions

### Favorite Button Animation
- **Effect**: Heartbeat with particle burst
- **Technical Approach**: 
  - Button scales with heartbeat pattern
  - Color fills from center outward
  - Particle burst on activation
  - Subtle sound effect (optional)
- **Duration**: 600ms
- **Easing**: Heartbeat curve (custom)
- **Color Transition**: Empty to filled state with glow effect

### Notification Badge Animation
- **Effect**: Energetic pop with pulse
- **Technical Approach**: 
  - Badge appears with pop animation
  - Number updates with flip animation
  - Subtle pulse effect continues to draw attention
  - Glow effect varies with notification importance
- **Duration**: Appearance: 300ms, Pulse: 2s cycle
- **Easing**: Elastic for pop (tension: 300, friction: 10)
- **Color Palette**: Red base (#FF4C4C) with variable glow intensity

### Success Confirmation
- **Effect**: Expanding circle with checkmark
- **Technical Approach**: 
  - Circle expands from center point
  - Checkmark draws with motion path
  - Particle effects emanate from completed checkmark
  - Subtle bounce at completion
- **Duration**: 700ms total sequence
- **Easing**: Circle: cubic-bezier(0.22, 1, 0.36, 1), Checkmark: cubic-bezier(0.34, 1.56, 0.64, 1)
- **Color Palette**: Success green (#5CE0B8) with white checkmark

### Error Indication
- **Effect**: Shake with energy dissipation
- **Technical Approach**: 
  - Element shakes horizontally with decreasing amplitude
  - Red glow pulse effect
  - Subtle particle effect shows energy dissipating
  - Icon transition (if applicable)
- **Duration**: 500ms
- **Easing**: Damped sine wave
- **Color Palette**: Error red (#FF4C4C) with pulsing glow

### Empty State Animation
- **Effect**: Gentle breathing with particle attraction
- **Technical Approach**: 
  - Illustration scales subtly in breathing pattern
  - Particles float around and occasionally gather
  - Subtle glow effect pulses
  - Responds slightly to device motion (if available)
- **Duration**: Continuous with 4s breathing cycle
- **Easing**: Sine wave for natural breathing
- **Color Palette**: Muted theme colors with occasional accent highlights

## Technical Implementation Notes

### Animation System Architecture
- Create base animation hooks for common patterns
- Implement shared animation context for coordinating complex sequences
- Use composition pattern for combining multiple animation effects
- Develop throttling system for performance optimization

### Performance Considerations
- Use `transform` and `opacity` properties for hardware acceleration
- Implement animation frame skipping for lower-end devices
- Create debug mode to visualize animation performance
- Set up conditional rendering for complex animations based on device capability

### Accessibility Features
- Honor reduced motion preferences from system settings
- Provide alternative non-animated feedback for all interactions
- Ensure all animated elements have appropriate ARIA attributes
- Implement pause functionality for continuous animations

### Reusable Components
- AnimatedTransition: For page transitions
- AnimatedList: For staggered item animations
- ParticleSystem: For bioluminescent particle effects
- PulseEffect: For attention-drawing animations
- GlowContainer: For elements with dynamic glow effects
