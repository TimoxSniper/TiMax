"use client";

import * as React from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sende Fehler an Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // In Development auch in Console loggen
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetError,
}: {
  error: Error | null;
  resetError: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="border-destructive/20 bg-destructive/5 w-full max-w-md rounded-lg border p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-destructive/10 rounded-full p-3">
            <AlertCircle className="text-destructive h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        <h2 className="text-foreground mb-2 text-lg font-semibold">Etwas ist schiefgelaufen</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche, die Seite neu zu laden.
        </p>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-4 text-left">
            <summary className="text-muted-foreground cursor-pointer text-xs">
              Fehlerdetails (nur in Entwicklung)
            </summary>
            <pre className="bg-muted mt-2 overflow-auto rounded p-2 text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <Button onClick={resetError} variant="default" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Erneut versuchen
        </Button>
      </div>
    </div>
  );
}
