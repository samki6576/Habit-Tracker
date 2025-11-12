'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualPrompt, setShowManualPrompt] = useState(false);

  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === 'undefined') return;

    // Check if app is already installed
    try {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }

      // Check if running as PWA (iOS Safari specific)
      if ('standalone' in window.navigator) {
        const nav = window.navigator as Navigator & { standalone?: boolean };
        if (nav.standalone === true) {
          setIsInstalled(true);
          return;
        }
      }

      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Check if app was installed
      window.addEventListener('appinstalled', () => {
        setIsInstalled(true);
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      });

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } catch (error) {
      console.error('Error in install prompt setup:', error);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
    } catch (error) {
      console.error('Error saving dismissal:', error);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Show automatic prompt if available
  if (showInstallPrompt && deferredPrompt) {
    return (
      <AlertDialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Install Habit Tracker</AlertDialogTitle>
            <AlertDialogDescription>
              Install this app on your device for a better experience. You'll be able to access it
              offline and get a native app-like experience.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDismiss}>
              <X className="mr-2 h-4 w-4" />
              Maybe Later
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleInstallClick}>
              <Download className="mr-2 h-4 w-4" />
              Install App
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Fallback: Show manual install instructions for Chrome
  useEffect(() => {
    // Only show manual prompt if automatic prompt didn't appear after a delay
    if (typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      try {
        if (!deferredPrompt && !isInstalled) {
          const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
          const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
          
          if (isChrome && !isStandalone) {
            // Check if user dismissed recently (within 24 hours)
            const dismissedTime = localStorage.getItem('pwa-install-dismissed');
            if (dismissedTime) {
              const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
              if (hoursSinceDismissed < 24) {
                return; // Don't show if dismissed recently
              }
            }
            setShowManualPrompt(true);
          }
        }
      } catch (error) {
        console.error('Error showing manual install prompt:', error);
      }
    }, 3000); // Wait 3 seconds before showing manual prompt

    return () => clearTimeout(timer);
  }, [deferredPrompt, isInstalled]);

  if (showManualPrompt && !isInstalled && !deferredPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
        <div className="bg-background border border-border rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Install Habit Tracker</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Click the install icon (⊕) in Chrome&apos;s address bar, or use the menu → Install
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleDismiss();
                    setShowManualPrompt(false);
                  }}
                  className="text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

