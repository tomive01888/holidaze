import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "../Button";

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /**
   * The child components that this boundary will protect.
   */
  children: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * A reusable component that catches JavaScript errors anywhere in its child
 * component tree, logs those errors, and displays a fallback UI instead of
 * the component tree that crashed.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };
  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * This lifecycle method is also triggered after an error.
   * It's the ideal place for side effects, like logging the error to a service.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white text-center p-4">
          <h1 className="text-3xl font-bold text-error">Oops! Something went wrong.</h1>
          <p className="mt-2 text-neutral-300 max-w-md">
            We're sorry for the inconvenience. An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-primary-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-primary-700 transition-colors"
          >
            Refresh Page
          </button>
          <Link to="/">
            <Button variant="primary" size="lg" type="button">
              Go back to home
            </Button>
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
