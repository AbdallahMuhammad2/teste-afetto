'use client';

import { ReactNode, useEffect } from 'react';
import '../lib/process-polyfill';

export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}