import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OTPScreen } from './screens/OTPScreen';
import { LocationScreen } from './screens/LocationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ProductListScreen } from './screens/ProductListScreen';
import { ComparatorScreen } from './screens/ComparatorScreen';
import { SavedScreen } from './screens/SavedScreen';
import { PriceHistoryScreen } from './screens/PriceHistoryScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export const router = createBrowserRouter([
  { path: '/', Component: SplashScreen },
  { path: '/onboarding', Component: OnboardingScreen },
  { path: '/auth', Component: AuthScreen },
  { path: '/otp', Component: OTPScreen },
  { path: '/location', Component: LocationScreen },
  { path: '/home', Component: HomeScreen },
  { path: '/search', Component: SearchScreen },
  { path: '/products', Component: ProductListScreen },
  { path: '/compare/:id', Component: ComparatorScreen },
  { path: '/saved', Component: SavedScreen },
  { path: '/history/:id', Component: PriceHistoryScreen },
  { path: '/alerts', Component: AlertsScreen },
  { path: '/profile', Component: ProfileScreen },
]);
