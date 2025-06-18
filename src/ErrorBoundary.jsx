// src/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ color: 'red', padding: '20px' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
