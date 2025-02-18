import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text text_type_main-medium text_color_error">
          Что-то пошло не так :(
          <br />
          {this.state.error.message}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
