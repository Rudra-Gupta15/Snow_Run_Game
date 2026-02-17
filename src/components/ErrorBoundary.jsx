import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-900 text-white p-8 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-black/50 p-6 rounded-lg max-w-2xl w-full overflow-auto text-left">
                        <h2 className="text-xl font-mono text-red-300 mb-2">{this.state.error && this.state.error.toString()}</h2>
                        <pre className="text-sm font-mono text-gray-400 whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 bg-white text-red-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        Reload Game
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
