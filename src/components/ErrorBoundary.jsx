import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5fbf8] px-6">
          <div className="w-full max-w-lg rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-sm">
            <h1 className="text-[28px] font-black text-[#111827]">
              Something went wrong
            </h1>

            <p className="mt-3 text-[15px] leading-6 text-[#6b7280]">
              We couldn't load this page. Please try again.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white transition hover:bg-[#2563eb]"
            >
              Try Again
            </button>

            {import.meta.env.DEV && this.state.error?.message && (
              <p className="mt-5 break-words rounded-lg bg-[#f8fafc] p-3 text-left text-xs text-[#6b7280]">
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary