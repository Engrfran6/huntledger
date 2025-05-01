import {getAnalytics, isSupported} from 'firebase/analytics';
import {app} from './firebase';

let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export {analytics};
