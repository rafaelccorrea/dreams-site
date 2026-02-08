// Chart.js Configuration - Robust registration for code splitting environments
// This file ensures Chart.js components are registered SYNCHRONOUSLY
// to prevent "scale not registered" errors with Vite code splitting

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  TimeScale,
  LogarithmicScale,
} from 'chart.js';

// Global state to track registration
let isRegistered = false;
let registrationPromise: Promise<void> | null = null;

// SYNCHRONOUS registration function - called immediately
const registerChartComponents = (): void => {
  if (isRegistered) return;

  try {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      RadialLinearScale,
      TimeScale,
      LogarithmicScale,
      BarElement,
      PointElement,
      LineElement,
      ArcElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );
    isRegistered = true;
    // console.log('[ChartConfig] Chart.js components registered successfully');
  } catch (error) {
    console.error(
      '[ChartConfig] Failed to register Chart.js components:',
      error
    );
    throw error;
  }
};

// Execute registration IMMEDIATELY when this module is first imported
registerChartComponents();

// Export the configured Chart instance
export { ChartJS };

// Check if registration is complete
export const isChartRegistered = (): boolean => {
  return isRegistered;
};

// Utility function to verify registration (can be used for debugging)
export const verifyChartRegistration = (): boolean => {
  try {
    const registry = ChartJS.registry;
    const hasLinear = registry.getScale('linear') !== undefined;
    const hasCategory = registry.getScale('category') !== undefined;
    return hasLinear && hasCategory && isRegistered;
  } catch {
    return false;
  }
};

// Export a function that can be called to ensure registration
// This is a no-op if already registered, but ensures the module is loaded
export const ensureChartRegistration = (): void => {
  if (!isRegistered) {
    registerChartComponents();
  }

  // Double-check and re-register if needed (for edge cases with code splitting)
  if (!verifyChartRegistration()) {
    console.warn(
      '[ChartConfig] Chart.js scales not properly registered, re-registering...'
    );
    ChartJS.register(
      CategoryScale,
      LinearScale,
      RadialLinearScale,
      TimeScale,
      LogarithmicScale,
      BarElement,
      PointElement,
      LineElement,
      ArcElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );
    isRegistered = true;
  }
};

// Async version for use with Suspense/lazy loading
export const ensureChartRegistrationAsync = (): Promise<void> => {
  if (registrationPromise) return registrationPromise;

  registrationPromise = new Promise<void>((resolve, reject) => {
    try {
      ensureChartRegistration();
      resolve();
    } catch (error) {
      reject(error);
    }
  });

  return registrationPromise;
};

// Force registration - use this at the app root level
export const forceChartRegistration = (): void => {
  isRegistered = false;
  registerChartComponents();
};
