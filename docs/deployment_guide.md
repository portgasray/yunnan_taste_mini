# Yunnan Taste Mini-Program Deployment Guide

This guide provides step-by-step instructions for deploying the Yunnan Taste Mini-Program to the WeChat Mini-Program platform.

## Prerequisites

- WeChat Developer Account with Mini-Program development permissions
- WeChat Developer Tools installed on your computer
- Project AppID from the WeChat Developer Platform

## Build Output

The production build has been successfully completed and the output is located in the `/dist` directory. The build includes all necessary files for the WeChat Mini-Program:

- `app.js` - Main application logic
- `app.json` - Application configuration
- `project.config.json` - Project configuration for WeChat Developer Tools
- Pages directory with all main application pages
- Custom tab bar implementation
- All required JavaScript bundles and assets

## Deployment Steps

### 1. Import Project into WeChat Developer Tools

1. Open WeChat Developer Tools on your computer
2. Click "Import Project"
3. Browse to the `dist` directory of the Yunnan Taste Mini-Program
4. Enter your Mini-Program AppID
5. Click "Import"

### 2. Configure Project Settings

1. In WeChat Developer Tools, go to "Details" > "Project Settings"
2. Ensure the following settings are configured:
   - ES6 to ES5 conversion is enabled
   - Minification is enabled
   - Component style isolation is set to "apply"
   - Check that NPM dependencies are correctly built

### 3. Preview and Test

1. Click the "Preview" button in WeChat Developer Tools
2. Scan the QR code with your WeChat app to preview the Mini-Program
3. Test all main functionality:
   - Home page navigation and content display
   - Category browsing and filtering
   - Product detail viewing
   - Search functionality
   - User center features

### 4. Upload for Review

1. Click "Upload" in WeChat Developer Tools
2. Fill in the version number (e.g., 1.0.0)
3. Add release notes describing the features and changes
4. Submit for review

### 5. Release to Production

After passing the WeChat review:
1. Log in to the WeChat Mini-Program Admin Platform
2. Go to "Versions" and find your approved version
3. Click "Release" to publish to all users

## Optimization Notes

The build process identified some optimization opportunities that should be addressed in future updates:

1. **Bundle Size**: The vendors.js bundle (305 KiB) exceeds the recommended size limit (244 KiB). This may impact performance, especially on slower networks.

2. **Code Splitting**: Implementing code splitting through dynamic imports would improve initial load times by loading code only when needed.

3. **Image Optimization**: Consider running the image optimization script before deployment to reduce asset sizes.

## Troubleshooting

### Common Issues

1. **Missing Dependencies**: If you encounter "module not found" errors, ensure all dependencies are correctly installed and built.

2. **Permission Issues**: Make sure your WeChat Developer account has the necessary permissions to upload and publish Mini-Programs.

3. **API Compatibility**: If certain features don't work, check the WeChat API version compatibility in project.config.json.

### Support Resources

- WeChat Mini-Program Documentation: https://developers.weixin.qq.com/miniprogram/en/dev/
- Taro Framework Documentation: https://taro-docs.jd.com/taro/

## Future Enhancements

For future deployments, consider implementing:

1. **Subpackages**: Split the application into subpackages to improve initial loading time
2. **Preload Strategy**: Implement strategic preloading of frequently accessed pages
3. **Component Optimization**: Reduce component re-renders and optimize complex animations
4. **Cache Management**: Implement better caching strategies for API responses

## Contact

For deployment assistance or questions, please contact the development team.
