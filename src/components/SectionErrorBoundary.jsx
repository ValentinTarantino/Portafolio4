import { Component } from 'react';
import './SectionErrorBoundary.css';

class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Section error boundary:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const copy = this.props.t?.errorBoundary;
      return (
        <div className="section-error-boundary" role="alert">
          <div className="section-error-boundary__panel">
            <span className="section-error-boundary__code" aria-hidden="true">ERR</span>
            <p className="section-error-boundary__title">{copy?.title ?? 'SYSTEM ERROR · SECTION UNAVAILABLE'}</p>
            <button type="button" className="section-error-boundary__retry" onClick={this.handleRetry}>
              {copy?.retry ?? 'RETRY'}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default SectionErrorBoundary;
