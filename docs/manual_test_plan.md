# Yunnan Taste Mini-Program Manual Test Plan

## Overview
This document outlines the manual testing procedures for the Yunnan Taste mini-program before deployment to the WeChat Mini-Program platform. These tests should be performed in the WeChat Developer Tools environment to ensure the application functions correctly in a production-like setting.

## Prerequisites
- WeChat Developer Tools installed
- Project built using `npm run build:weapp`
- Test user accounts (regular user, admin user)
- Test payment credentials (for payment testing)

## Test Environment Setup
1. Import the built project (`/dist` directory) into WeChat Developer Tools
2. Configure the developer tool to use the test environment API endpoints
3. Enable debug mode for detailed logging
4. Set device simulation to various screen sizes (small, medium, large)

## Functional Test Cases

### 1. Navigation and Core UI

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 1.1 | TabBar Navigation | Tap each tab icon (Home, Category, Search, User) | Should navigate to the corresponding page with smooth transition animation | ⬜ |
| 1.2 | Page Transitions | Navigate between different pages | Transitions should be smooth with bioluminescent effects | ⬜ |
| 1.3 | Pull-to-Refresh | Pull down on scrollable content | Content should refresh with loading animation | ⬜ |
| 1.4 | Infinite Scroll | Scroll to bottom of product lists | Additional products should load automatically | ⬜ |
| 1.5 | Back Navigation | Use system back button/gesture | Should navigate to previous page with correct animation | ⬜ |
| 1.6 | Theme Consistency | Check all pages and components | All elements should follow Bioluminescent Forest theme | ⬜ |

### 2. Home Page

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 2.1 | Banner Display | Open home page | Banner should load with images and animations | ⬜ |
| 2.2 | Banner Carousel | Wait for banner carousel | Should auto-rotate and respond to swipe gestures | ⬜ |
| 2.3 | Category Navigation | Tap category icons | Should navigate to corresponding category page | ⬜ |
| 2.4 | Featured Products | Scroll to featured products | Products should display with correct information | ⬜ |
| 2.5 | Product Card Tap | Tap on a product card | Should navigate to product detail page | ⬜ |
| 2.6 | Content Sections | Scroll through content sections | Heritage and article sections should display correctly | ⬜ |

### 3. Category Page

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 3.1 | Category List | Open category page | Categories should display with images and names | ⬜ |
| 3.2 | Subcategory Navigation | Tap on subcategory tabs | Product list should update accordingly | ⬜ |
| 3.3 | Filter Function | Tap filter button and select options | Products should filter based on selections | ⬜ |
| 3.4 | Sort Function | Tap sort button and select option | Products should sort accordingly (price, popularity) | ⬜ |
| 3.5 | Filter Reset | Tap reset button in filter drawer | All filters should reset to default | ⬜ |
| 3.6 | Empty State | Apply filter with no results | Empty state should display with appropriate message | ⬜ |

### 4. Product Detail Page

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 4.1 | Image Gallery | Open product detail and swipe images | Gallery should respond to swipes with pagination | ⬜ |
| 4.2 | Product Info | Check product information | Title, price, discount, rating should display correctly | ⬜ |
| 4.3 | Specification Selection | Select different specifications | Selection should update with visual feedback | ⬜ |
| 4.4 | Quantity Control | Use +/- buttons to change quantity | Quantity should update with limits enforced | ⬜ |
| 4.5 | Add to Cart | Tap "Add to Cart" button | Product should add to cart with animation | ⬜ |
| 4.6 | Buy Now | Tap "Buy Now" button | Should navigate to checkout page | ⬜ |
| 4.7 | Favorite Toggle | Tap heart icon | Favorite status should toggle with animation | ⬜ |
| 4.8 | Related Products | Scroll to related products | Should display relevant products in carousel | ⬜ |

### 5. Search Page

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 5.1 | Search Input | Enter text in search field | Input should work with keyboard showing | ⬜ |
| 5.2 | Search Execution | Press search button | Search results should display with loading state | ⬜ |
| 5.3 | Search History | Perform searches and check history | Recent searches should appear in history | ⬜ |
| 5.4 | Clear History | Tap clear history button | Search history should be cleared | ⬜ |
| 5.5 | Popular Searches | Check popular searches section | Should display trending search terms | ⬜ |
| 5.6 | No Results | Search for non-existent item | Empty state should display with suggestions | ⬜ |
| 5.7 | Voice Search | Tap microphone icon | Voice input should activate (if supported) | ⬜ |

### 6. User Center Page

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 6.1 | Guest View | Open user center without login | Login prompt should display | ⬜ |
| 6.2 | User Login | Complete login process | User information should display after login | ⬜ |
| 6.3 | Order History | Tap on orders section | Order history should display with status | ⬜ |
| 6.4 | Favorites | Tap on favorites section | Favorited products should display | ⬜ |
| 6.5 | View History | Check browsing history section | Recently viewed products should display | ⬜ |
| 6.6 | Settings | Navigate to settings | Settings options should display and function | ⬜ |
| 6.7 | Logout | Tap logout button | User should be logged out with confirmation | ⬜ |

### 7. Cart and Checkout

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| 7.1 | Cart Display | Open cart page | Cart items should display with correct info | ⬜ |
| 7.2 | Update Quantity | Change item quantity in cart | Total should update accordingly | ⬜ |
| 7.3 | Remove Item | Remove item from cart | Item should be removed with animation | ⬜ |
| 7.4 | Empty Cart | Remove all items | Empty cart state should display | ⬜ |
| 7.5 | Checkout Process | Proceed to checkout | Address and payment options should display | ⬜ |
| 7.6 | Address Selection | Select delivery address | Selected address should be highlighted | ⬜ |
| 7.7 | Payment Selection | Select payment method | Selected method should be highlighted | ⬜ |
| 7.8 | Order Submission | Submit order | Order confirmation should display | ⬜ |

## Performance Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| P.1 | Initial Load Time | Cold start the application | App should load within 3 seconds | ⬜ |
| P.2 | Page Navigation | Navigate between main pages | Page transitions should complete within 300ms | ⬜ |
| P.3 | Scroll Performance | Scroll rapidly through long lists | Scrolling should remain smooth at 60fps | ⬜ |
| P.4 | Image Loading | Navigate to image-heavy pages | Images should load progressively with placeholders | ⬜ |
| P.5 | Animation Performance | Trigger animations (transitions, effects) | Animations should run at 60fps without jank | ⬜ |
| P.6 | Memory Usage | Use app for extended period | Memory usage should remain stable | ⬜ |
| P.7 | Network Failure | Test with network disconnected | App should handle offline state gracefully | ⬜ |
| P.8 | Slow Network | Test with throttled network | App should display appropriate loading states | ⬜ |

## Compatibility Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| C.1 | Small Screen | Test on small screen device | UI should adapt correctly | ⬜ |
| C.2 | Large Screen | Test on large screen device | UI should utilize space effectively | ⬜ |
| C.3 | Orientation Change | Rotate device (if applicable) | Layout should adjust appropriately | ⬜ |
| C.4 | System Font Size | Change system font size | Text should remain readable | ⬜ |
| C.5 | Dark Mode | Test with system dark mode | App should maintain readability | ⬜ |
| C.6 | WeChat Version | Test on minimum supported WeChat version | All features should function correctly | ⬜ |

## Security Test Cases

| ID | Test Case | Steps | Expected Result | Status |
|----|-----------|-------|-----------------|--------|
| S.1 | Data Validation | Submit invalid data in forms | App should validate and show appropriate errors | ⬜ |
| S.2 | Session Handling | Test after session timeout | App should prompt for re-authentication | ⬜ |
| S.3 | Sensitive Data | Check for sensitive data in storage | No unencrypted sensitive data should be stored | ⬜ |
| S.4 | Permission Usage | Check permission requests | Only necessary permissions should be requested | ⬜ |

## Exploratory Testing

Spend at least 30 minutes using the application naturally, focusing on:

1. User flows that combine multiple features
2. Edge cases in product selection and checkout
3. Rapid navigation between different sections
4. Unusual interaction patterns (rapid taps, long presses)
5. Interruptions (incoming calls, notifications)

Document any issues or unexpected behaviors encountered during exploratory testing.

## Regression Testing

After any significant changes or bug fixes, repeat the following test cases:
- All TabBar navigation (1.1)
- Home page loading (2.1)
- Product detail viewing (4.1-4.3)
- Search functionality (5.1-5.2)
- Cart operations (7.1-7.3)

## Test Reporting

For each failed test case:
1. Document the exact steps to reproduce
2. Capture screenshots or recordings
3. Note the environment details (device, OS version)
4. Assign a severity level (Critical, High, Medium, Low)

## Final Checklist Before Submission

- [ ] All critical and high-severity issues resolved
- [ ] Performance meets or exceeds requirements
- [ ] WeChat-specific APIs function correctly
- [ ] Bundle size is within WeChat limits
- [ ] All assets are optimized
- [ ] Permissions are properly configured
- [ ] Privacy policy is up to date
