/**
 * Device Detection and Mobile Utilities
 */

// Local narrow shape for vendor-specific legacy globals (Opera Presto, IE).
// Kept off the global Window type so the lib.dom contract stays intact.
interface LegacyNavigatorGlobals {
  opera?: string;
  MSStream?: unknown;
}

/**
 * 모바일 디바이스 감지
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  // User agent 체크
  const userAgent = navigator.userAgent || navigator.vendor || (window as Window & LegacyNavigatorGlobals).opera || '';
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

  // Touch 지원 여부
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 화면 크기
  const isSmallScreen = window.innerWidth <= 768;

  return mobileRegex.test(userAgent) || (hasTouch && isSmallScreen);
}

/**
 * 태블릿 감지
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  const isLargeTouch = 'ontouchstart' in window && window.innerWidth >= 768 && window.innerWidth <= 1024;

  return isTabletUA || isLargeTouch;
}

/**
 * iOS 감지
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & LegacyNavigatorGlobals).MSStream;
}

/**
 * Android 감지
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /android/i.test(navigator.userAgent);
}

/**
 * 화면 방향 가져오기
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait';
  
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

/**
 * 반응형 캔버스 크기 계산
 */
export function getResponsiveCanvasSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 1024, height: 880 };
  }

  const mobile = isMobileDevice();
  const tablet = isTablet();
  const orientation = getOrientation();

  if (mobile && !tablet) {
    // 모바일: 화면에 맞춤
    const maxWidth = Math.min(window.innerWidth - 32, 600);
    const maxHeight = window.innerHeight - 200;
    
    if (orientation === 'portrait') {
      return { width: maxWidth, height: Math.min(maxHeight, maxWidth * 1.2) };
    } else {
      return { width: maxWidth, height: Math.min(maxHeight, maxWidth * 0.7) };
    }
  } else if (tablet) {
    // 태블릿: 중간 크기
    const maxWidth = Math.min(window.innerWidth - 64, 800);
    return { width: maxWidth, height: maxWidth * 0.85 };
  } else {
    // 데스크톱: 고정 크기
    return { width: 1024, height: 880 };
  }
}

/**
 * 가상 키보드 표시 여부 확인
 */
export function needsVirtualKeyboard(): boolean {
  return isMobileDevice() && !isTablet();
}

/**
 * 디바이스 정보 로깅 (디버그용)
 */
export function logDeviceInfo() {
  console.log('[Device Info]', {
    mobile: isMobileDevice(),
    tablet: isTablet(),
    iOS: isIOS(),
    android: isAndroid(),
    orientation: getOrientation(),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
  });
}
