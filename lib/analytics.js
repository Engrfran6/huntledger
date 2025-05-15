// lib/analytics.js
import {getAnalytics, isSupported} from 'firebase/analytics';
import {app} from './firebase';

let analytics;

export const initializeAnalytics = async () => {
  if (typeof window === 'undefined') return null;

  try {
    const supported = await isSupported();
    if (supported && app) {
      analytics = getAnalytics(app);
      return analytics;
    }
    return null;
  } catch (error) {
    console.error('Analytics initialization failed:', error);
    return null;
  }
};

export const getFirebaseAnalytics = () => analytics;
