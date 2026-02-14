import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Catches render errors so you see a message instead of a blank page. */
export class ErrorFallback extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            maxWidth: 560,
            margin: '40px auto',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
          }}
        >
          <h1 style={{ margin: '0 0 12px', fontSize: 18, color: '#991b1b' }}>
            Something went wrong
          </h1>
          <p style={{ margin: 0, color: '#b91c1c', fontSize: 14 }}>
            {this.state.error.message}
          </p>
          <p style={{ margin: '12px 0 0', fontSize: 12, color: '#737373' }}>
            Check the browser console (F12) for details.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
