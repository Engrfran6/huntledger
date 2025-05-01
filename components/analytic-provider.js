'use client';

import {analytics} from '@/lib/analytics';
import {useEffect} from 'react';

export function AnalyticsProvider() {
  useEffect(() => {
    console.log('Firebase Analytics Initialized:', analytics);
  }, []);

  return null;
}
