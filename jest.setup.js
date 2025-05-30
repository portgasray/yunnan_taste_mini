/**
 * Jest setup file for Yunnan Taste Mini-Program
 * Configures the test environment and mocks
 */

// Mock Taro API
const taroMock = {
  getSystemInfoSync: jest.fn().mockReturnValue({
    platform: 'devtools',
    system: 'iOS 16.0',
    screenWidth: 375,
    screenHeight: 812,
    windowWidth: 375,
    windowHeight: 812,
    pixelRatio: 2,
    statusBarHeight: 44,
    language: 'zh_CN',
    version: '8.0.5',
    benchmarkLevel: 50
  }),
  
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn().mockResolvedValue({ confirm: true }),
  navigateTo: jest.fn(),
  switchTab: jest.fn(),
  redirectTo: jest.fn(),
  navigateBack: jest.fn(),
  
  request: jest.fn().mockImplementation(({ success, fail }) => {
    success && success({ statusCode: 200, data: {} });
    return Promise.resolve({ statusCode: 200, data: {} });
  }),
  
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),
  
  createSelectorQuery: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    selectAll: jest.fn().mockReturnThis(),
    selectViewport: jest.fn().mockReturnThis(),
    exec: jest.fn().mockImplementation(callback => {
      callback && callback([{ width: 100, height: 100, top: 0, left: 0 }]);
      return [{ width: 100, height: 100, top: 0, left: 0 }];
    })
  }),
  
  nextTick: jest.fn().mockImplementation(callback => {
    setTimeout(callback, 0);
  }),
  
  getCurrentInstance: jest.fn().mockReturnValue({
    router: {
      params: {}
    }
  })
};

// Mock Taro
jest.mock('@tarojs/taro', () => taroMock);

// Mock canvas
class MockCanvasRenderingContext2D {
  constructor() {
    this.canvas = {
      width: 0,
      height: 0
    };
    
    // Add all methods as jest mocks
    this.fillRect = jest.fn();
    this.clearRect = jest.fn();
    this.getImageData = jest.fn();
    this.putImageData = jest.fn();
    this.createImageData = jest.fn();
    this.setLineDash = jest.fn();
    this.getLineDash = jest.fn();
    this.measureText = jest.fn().mockReturnValue({ width: 0 });
    this.createLinearGradient = jest.fn();
    this.createRadialGradient = jest.fn();
    this.createPattern = jest.fn();
    this.createImageData = jest.fn();
    
    // Path methods
    this.beginPath = jest.fn();
    this.closePath = jest.fn();
    this.moveTo = jest.fn();
    this.lineTo = jest.fn();
    this.bezierCurveTo = jest.fn();
    this.quadraticCurveTo = jest.fn();
    this.arc = jest.fn();
    this.arcTo = jest.fn();
    this.ellipse = jest.fn();
    this.rect = jest.fn();
    
    // Drawing methods
    this.fill = jest.fn();
    this.stroke = jest.fn();
    this.drawImage = jest.fn();
    this.fillText = jest.fn();
    this.strokeText = jest.fn();
    
    // State methods
    this.save = jest.fn();
    this.restore = jest.fn();
    this.rotate = jest.fn();
    this.scale = jest.fn();
    this.translate = jest.fn();
    this.transform = jest.fn();
    this.setTransform = jest.fn();
    this.resetTransform = jest.fn();
    
    // Properties (getters/setters)
    this._fillStyle = '#000000';
    this._strokeStyle = '#000000';
    this._lineWidth = 1;
    this._font = '10px sans-serif';
    this._textAlign = 'start';
    this._textBaseline = 'alphabetic';
    this._direction = 'ltr';
    this._globalAlpha = 1.0;
    this._globalCompositeOperation = 'source-over';
    this._imageSmoothingEnabled = true;
    this._imageSmoothingQuality = 'low';
    this._lineCap = 'butt';
    this._lineJoin = 'miter';
    this._miterLimit = 10;
    this._shadowBlur = 0;
    this._shadowColor = 'rgba(0, 0, 0, 0)';
    this._shadowOffsetX = 0;
    this._shadowOffsetY = 0;
  }
  
  // Define getters and setters for properties
  get fillStyle() { return this._fillStyle; }
  set fillStyle(value) { this._fillStyle = value; }
  
  get strokeStyle() { return this._strokeStyle; }
  set strokeStyle(value) { this._strokeStyle = value; }
  
  get lineWidth() { return this._lineWidth; }
  set lineWidth(value) { this._lineWidth = value; }
  
  get font() { return this._font; }
  set font(value) { this._font = value; }
  
  get textAlign() { return this._textAlign; }
  set textAlign(value) { this._textAlign = value; }
  
  get textBaseline() { return this._textBaseline; }
  set textBaseline(value) { this._textBaseline = value; }
  
  get direction() { return this._direction; }
  set direction(value) { this._direction = value; }
  
  get globalAlpha() { return this._globalAlpha; }
  set globalAlpha(value) { this._globalAlpha = value; }
  
  get globalCompositeOperation() { return this._globalCompositeOperation; }
  set globalCompositeOperation(value) { this._globalCompositeOperation = value; }
  
  get imageSmoothingEnabled() { return this._imageSmoothingEnabled; }
  set imageSmoothingEnabled(value) { this._imageSmoothingEnabled = value; }
  
  get imageSmoothingQuality() { return this._imageSmoothingQuality; }
  set imageSmoothingQuality(value) { this._imageSmoothingQuality = value; }
  
  get lineCap() { return this._lineCap; }
  set lineCap(value) { this._lineCap = value; }
  
  get lineJoin() { return this._lineJoin; }
  set lineJoin(value) { this._lineJoin = value; }
  
  get miterLimit() { return this._miterLimit; }
  set miterLimit(value) { this._miterLimit = value; }
  
  get shadowBlur() { return this._shadowBlur; }
  set shadowBlur(value) { this._shadowBlur = value; }
  
  get shadowColor() { return this._shadowColor; }
  set shadowColor(value) { this._shadowColor = value; }
  
  get shadowOffsetX() { return this._shadowOffsetX; }
  set shadowOffsetX(value) { this._shadowOffsetX = value; }
  
  get shadowOffsetY() { return this._shadowOffsetY; }
  set shadowOffsetY(value) { this._shadowOffsetY = value; }
}

// Mock HTMLCanvasElement
global.HTMLCanvasElement = class {
  constructor() {
    this.width = 0;
    this.height = 0;
  }
  
  getContext(contextType) {
    if (contextType === '2d') {
      return new MockCanvasRenderingContext2D();
    }
    return null;
  }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Map();
  }
  
  observe(element) {
    this.elements.set(element, {
      isIntersecting: false,
      intersectionRatio: 0
    });
  }
  
  unobserve(element) {
    this.elements.delete(element);
  }
  
  disconnect() {
    this.elements.clear();
  }
  
  // Helper method to trigger intersection
  triggerIntersection(element, isIntersecting, ratio = isIntersecting ? 1 : 0) {
    if (this.elements.has(element)) {
      const entry = {
        target: element,
        isIntersecting,
        intersectionRatio: ratio,
        boundingClientRect: {},
        intersectionRect: {},
        rootBounds: null,
        time: Date.now()
      };
      this.callback([entry], this);
    }
  }
};

// Mock file
global.File = class {
  constructor(bits, name, options = {}) {
    this.name = name;
    this.size = bits.reduce((acc, bit) => acc + (bit.size || bit.length || 0), 0);
    this.type = options.type || '';
    this.lastModified = options.lastModified || Date.now();
  }
};

// Mock URL
global.URL = {
  createObjectURL: jest.fn().mockReturnValue('mock-object-url'),
  revokeObjectURL: jest.fn()
};

// Add custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  }
});

// Console mocks to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Clean up after tests
afterEach(() => {
  jest.clearAllMocks();
});
