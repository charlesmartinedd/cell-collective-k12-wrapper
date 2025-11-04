import React, { useState } from 'react'

interface Component {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

const AVAILABLE_COMPONENTS: Component[] = [
  { id: 'gene', name: 'Gene', icon: '🧬', color: 'bg-blue-500', description: 'A unit of heredity' },
  { id: 'protein', name: 'Protein', icon: '🦠', color: 'bg-purple-500', description: 'Building blocks of life' },
  { id: 'receptor', name: 'Receptor', icon: '📡', color: 'bg-green-500', description: 'Receives signals' },
  { id: 'enzyme', name: 'Enzyme', icon: '⚗️', color: 'bg-orange-500', description: 'Speeds up reactions' },
  { id: 'hormone', name: 'Hormone', icon: '💊', color: 'bg-pink-500', description: 'Chemical messenger' },
  { id: 'ion', name: 'Ion', icon: '⚡', color: 'bg-yellow-500', description: 'Charged particle' }
]

const ModelBuilder: React.FC = () => {
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
  const [modelName, setModelName] = useState('')

  const addComponent = (component: Component) => {
    setSelectedComponents([...selectedComponents, { ...component, id: `${component.id}-${Date.now()}` }])
  }

  const removeComponent = (id: string) => {
    setSelectedComponents(selectedComponents.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gradient-primary">
          🔬 Build Your Model
        </h1>
        <p className="text-xl text-gray-600">
          Drag components to create your own biological model
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component Palette */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📦 Components</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click to add components to your model
            </p>
            <div className="space-y-2">
              {AVAILABLE_COMPONENTS.map((component) => (
                <button
                  key={component.id}
                  onClick={() => addComponent(component)}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-primary-300 hover:shadow-medium transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${component.color} flex items-center justify-center text-2xl shadow-soft group-hover:scale-110 transition-transform`}>
                      {component.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{component.name}</div>
                      <div className="text-xs text-gray-600">{component.description}</div>
                    </div>
                    <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-gradient-to-br from-primary-50 to-secondary-50">
            <h3 className="text-lg font-bold mb-3 text-gray-800">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Add components by clicking them</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Remove by clicking the × button</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Connect components to show interactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Save your model to run simulations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 space-y-4">
          {/* Model Name */}
          <div className="card">
            <input
              type="text"
              placeholder="Name your model..."
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="input text-2xl font-bold"
            />
          </div>

          {/* Canvas Area */}
          <div className="card min-h-[500px] bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-10 h-full">
                {[...Array(100)].map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>

            {/* Instructions or Components */}
            {selectedComponents.length === 0 ? (
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-pulse-soft">🎨</div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3">
                    Start Building!
                  </h3>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Click components on the left to add them to your model.
                    Then connect them to show how they interact!
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative z-10 p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Your Model ({selectedComponents.length} components)
                  </h3>
                  <button
                    onClick={() => setSelectedComponents([])}
                    className="btn btn-outline text-sm"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedComponents.map((component) => (
                    <div
                      key={component.id}
                      className="card bg-white group relative animate-scale-in"
                    >
                      <button
                        onClick={() => removeComponent(component.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold hover:bg-red-600"
                      >
                        ×
                      </button>
                      <div className={`w-16 h-16 rounded-2xl ${component.color} flex items-center justify-center text-4xl shadow-medium mb-3 mx-auto`}>
                        {component.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-800 mb-1">{component.name}</div>
                        <div className="text-xs text-gray-600">{component.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="btn btn-primary flex-1 text-lg" disabled={selectedComponents.length === 0}>
              💾 Save Model
            </button>
            <button className="btn btn-success flex-1 text-lg" disabled={selectedComponents.length === 0}>
              ▶️ Run Simulation
            </button>
            <button className="btn btn-outline flex-1 text-lg">
              📤 Export
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelBuilder
