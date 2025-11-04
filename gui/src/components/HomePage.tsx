import { useState } from 'react'
import Dashboard from './Dashboard'
import ModelBrowser from './ModelBrowser'
import ModelBuilder from './ModelBuilder'

type View = 'dashboard' | 'browse' | 'build' | 'simulate'

function HomePage() {
  const [currentView, setCurrentView] = useState<View>('dashboard')

  const handleNavigate = (view: string) => {
    setCurrentView(view as View)
  }

  return (
    <div className="min-h-screen">
      {/* Navigation Header - Apple/Microsoft inspired */}
      <header className="glass sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-medium">
                🧬
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gradient-primary">
                  Cell Explorer
                </h1>
                <p className="text-sm text-gray-600">Learn Biology Through Simulation</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  currentView === 'dashboard'
                    ? 'bg-primary-500 text-white shadow-medium'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                🏠 Home
              </button>
              <button
                onClick={() => setCurrentView('browse')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  currentView === 'browse'
                    ? 'bg-primary-500 text-white shadow-medium'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                📚 Browse Models
              </button>
              <button
                onClick={() => setCurrentView('build')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  currentView === 'build'
                    ? 'bg-primary-500 text-white shadow-medium'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                🔬 Build Model
              </button>
              <button
                onClick={() => setCurrentView('simulate')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  currentView === 'simulate'
                    ? 'bg-primary-500 text-white shadow-medium'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                ⚡ Simulate
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <button className="btn btn-outline text-sm">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentView === 'browse' && <ModelBrowser />}
          {currentView === 'build' && <ModelBuilder />}
          {currentView === 'simulate' && (
            <div className="text-center py-20">
              <div className="inline-block p-8 rounded-3xl gradient-primary text-white shadow-strong animate-scale-in">
                <h2 className="text-4xl font-bold mb-4">⚡ Simulation Coming Soon!</h2>
                <p className="text-lg opacity-90">Watch cells come alive with interactive simulations</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 glass">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p className="text-sm">
            Built with ❤️ for K-12 Students | Powered by Cell Collective
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
