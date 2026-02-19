'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 max-w-md mx-auto text-center">
          <div className="space-y-4">
            <div className="mx-auto bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-destructive font-bold text-xl">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ein Fehler ist aufgetreten</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Etwas ist schiefgegangen. Bitte versuche es nochmal.
              </p>
            </div>
            <div className="pt-2">
              <Button onClick={this.handleRetry} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Erneut versuchen
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;