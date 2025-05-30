# WeChat Mini-Program Requirements and Limitations Guide

## Overview
This document outlines the specific requirements and limitations for deploying the Yunnan Taste mini-program to the WeChat platform. Addressing these considerations is crucial for successful deployment and approval.

## Size Limitations

### Package Size Constraints
- **Main Package Limit**: 2MB maximum
- **Subpackage Limit**: 2MB per subpackage
- **Total Size Limit**: 20MB for all packages combined

Our current implementation uses subpackages to stay within these limits:
- Main package contains essential UI components and frequently used pages
- Product details are in a separate subpackage
- Order and checkout functionality is in another subpackage
- Content pages (articles, heritage) are in a dedicated subpackage

### Asset Optimization Requirements
- Images must be compressed and optimized (implemented in `scripts/optimize-images.js`)
- SVG files should be minimized
- Large static resources should be hosted externally when possible
- Consider using WeChat CDN for frequently accessed resources

## API Permissions

### Required Permissions
The Yunnan Taste mini-program requires the following WeChat permissions:

| Permission | Usage | Configuration |
|------------|-------|---------------|
| `scope.userInfo` | User profile access | Required during login flow |
| `scope.userLocation` | Delivery address suggestion | Optional, requested on demand |
| `scope.writePhotosAlbum` | Save product images | Optional, requested on demand |
| `scope.camera` | QR code scanning | Optional, requested on demand |

### Permission Request Best Practices
- Always request permissions contextually when needed
- Provide clear explanation for why each permission is needed
- Handle rejection gracefully with alternative flows
- Never request unnecessary permissions

## WeChat-Specific APIs

### Required API Implementations
The following WeChat-specific APIs are used in our mini-program:

1. **Login and Authentication**
   - `wx.login()` for code acquisition
   - `wx.getUserInfo()` for profile information
   - Implementation in `src/services/authService.ts`

2. **Payment Integration**
   - `wx.requestPayment()` for WeChat Pay
   - Implementation in `src/services/paymentService.ts`

3. **Share Functionality**
   - `wx.showShareMenu()` for enabling sharing
   - `wx.onShareAppMessage()` for custom share content
   - Implementation in product detail and content pages

4. **Storage APIs**
   - `wx.setStorageSync()` and `wx.getStorageSync()` for local data
   - Implementation in `src/services/storageService.ts`

5. **Network Requests**
   - `wx.request()` for API calls
   - Implementation wrapped in `src/services/apiClient.ts`

### API Compatibility Layer
Our implementation includes a compatibility layer in `src/utils/platform.ts` that:
- Provides consistent API access across platforms
- Handles WeChat-specific error cases
- Implements fallbacks for unsupported features

## UI and Interaction Requirements

### Navigation Bar
- Must follow WeChat design guidelines
- Custom navigation bar implemented in `src/components/NavBar.tsx`
- Supports WeChat's gesture-based navigation

### TabBar
- Limited to 2-5 tabs (we use 4)
- Custom TabBar implemented in `src/custom-tab-bar/index.tsx`
- Follows WeChat interaction patterns

### Pull-down Refresh
- Implemented using `enablePullDownRefresh` in page configuration
- Custom refresh indicators match our Bioluminescent Forest theme

### Back Button Behavior
- Properly handles WeChat's back gesture and button
- Confirms before exiting critical flows (checkout, forms)

## Security Requirements

### Data Storage
- Sensitive user data is never stored in local storage
- Authentication tokens use secure storage practices
- Personal information is encrypted when necessary

### Network Security
- All API requests use HTTPS
- Certificate pinning implemented for critical endpoints
- Data validation occurs both client and server-side

### Code Protection
- Sensitive business logic moved to server-side
- Obfuscation applied to critical client-side code
- No hardcoded secrets or credentials in the codebase

## Performance Requirements

### Startup Performance
- Cold start optimized to under 3 seconds
- Critical resources preloaded in main package
- Non-essential resources loaded on demand

### Runtime Performance
- Animations optimized for 60fps
- Event handlers debounced/throttled
- Memory usage monitored and optimized

### Network Efficiency
- Requests batched when possible
- Response data minimized
- Caching implemented for appropriate resources

## Compatibility Considerations

### WeChat Version Support
- Minimum supported version: WeChat 7.0.0
- Feature detection used for newer APIs
- Fallbacks implemented for older versions

### Device Compatibility
- Tested on various screen sizes
- Responsive design adapts to different pixel densities
- Touch targets sized appropriately for all devices

## Submission Requirements

### Privacy Policy
- Comprehensive privacy policy created
- Clearly explains data collection and usage
- Complies with relevant regulations

### User Terms
- User agreement created
- Clearly outlines usage terms
- Available within the mini-program

### Testing Account
- Test account created for reviewers
- Sample data populated
- All features accessible for review

## Implementation Status

| Requirement Category | Status | Notes |
|---------------------|--------|-------|
| Size Limitations | ✅ | Subpackage structure implemented |
| API Permissions | ✅ | All permissions properly requested |
| WeChat-Specific APIs | ✅ | All required APIs implemented |
| UI Requirements | ✅ | Follows WeChat design guidelines |
| Security Requirements | ✅ | All security measures implemented |
| Performance Requirements | ✅ | Optimized for WeChat environment |
| Compatibility | ✅ | Tested across supported versions |
| Submission Requirements | ✅ | All documentation prepared |

## Next Steps

1. Final validation in WeChat Developer Tools
2. Test on various physical devices
3. Submit for WeChat review
4. Address any feedback from the review process
5. Prepare for production release
