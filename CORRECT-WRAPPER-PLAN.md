# Cell Collective K-12 Wrapper - CORRECT Architecture

**Date:** 2025-11-04
**Status:** ✅ API Confirmed Working - Ready to Build Proper Wrapper

---

## 🎯 What We're Actually Building

A **K-12 wrapper for research.cellcollective.org** that:
- Calls Cell Collective's REAL APIs
- Shows Cell Collective's REAL biological models
- Wraps their 3 core features with kid-friendly UI:
  1. **Build Models** - Biological model creation
  2. **Design Experiments** - Set up simulations
  3. **Interpret Data** - Analyze results

**NOT:** A generic "learn about cells" educational app
**YES:** A simplified interface to Cell Collective's actual biological modeling platform

---

## 📍 What I Built Wrong

### ❌ Current (WRONG) Implementation
```typescript
// Generic cell education app
const SAMPLE_MODELS = [
  { name: 'Cell Cycle Regulation', category: 'Cell Biology' },
  { name: 'Apoptosis Signaling', category: 'Disease' },
  // ... FAKE models
]
```

- No API calls to Cell Collective
- Fake sample models
- Generic educational content
- Not connected to real biological modeling

### ✅ What Should Be Built
```typescript
// Actual Cell Collective wrapper
const fetchModels = async () => {
  const response = await fetch('https://research.cellcollective.org/web/_api/initialize');
  const data = await response.json();
  // Use REAL Cell Collective data
  return data.models; // Real biological models
}
```

---

## 🔌 Confirmed Cell Collective API

### ✅ Working Endpoint
```bash
GET https://research.cellcollective.org/web/_api/initialize
```

**Returns:**
```json
{
  "definitionMap": {
    "1": {"name": "TargetAudience", "type": "Text"},
    "2": {"name": "LearningType", "type": "Text"},
    "3": {"name": "Cover", "type": "Attachment"},
    "4": {"name": "EstimatedTime", "type": "Decimal"},
    "7": {"name": "LearningObjective", "type": "Text"}
  },
  "metadataValueRangeMap": {
    "19864935": {"definitionId": 1, "value": "Kindergarten"},
    "19864936": {"definitionId": 1, "value": "1st Grade"},
    // ... through Graduate level
    "7": {"definitionId": 2, "value": "Investigation"},
    "8": {"definitionId": 2, "value": "Editing"}
  },
  "modelDomainAccessList": [],
  "subscriptionExpires": null
}
```

**CORS:** ✅ Enabled (`access-control-allow-origin: *`)
**Auth:** ❓ May need session/token for model access

---

## 🏗️ Correct Architecture

### 1. **API Integration Layer** (`src/api/cellCollective.ts`)

```typescript
const API_BASE = 'https://research.cellcollective.org/web/_api';

export class CellCollectiveAPI {
  async initialize() {
    const res = await fetch(`${API_BASE}/initialize`);
    return res.json();
  }

  async getModels() {
    // TODO: Find endpoint for model list
    const res = await fetch(`${API_BASE}/models`);
    return res.json();
  }

  async getModel(id: number) {
    const res = await fetch(`${API_BASE}/models/${id}`);
    return res.json();
  }

  async runSimulation(modelId: number, params: any) {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId, ...params })
    });
    return res.json();
  }
}
```

### 2. **Dashboard** (Cell Collective's 3 Features)

```typescript
const Dashboard = () => {
  return (
    <div className="hero">
      <h1>🧬 Cell Collective - K-12 Edition</h1>
      <p>Learn biological systems through interactive modeling!</p>

      <div className="cards-grid">
        {/* Feature 1: Build Models */}
        <div className="card" onClick={() => navigate('/models')}>
          <span className="card-icon">🧬</span>
          <h3>Build Models</h3>
          <p>Create biological models by connecting genes, proteins, and cellular components</p>
        </div>

        {/* Feature 2: Design Experiments */}
        <div className="card" onClick={() => navigate('/experiments')}>
          <span className="card-icon">🔬</span>
          <h3>Design Experiments</h3>
          <p>Set up simulations to test how biological systems behave</p>
        </div>

        {/* Feature 3: Interpret Data */}
        <div className="card" onClick={() => navigate('/results')}>
          <span className="card-icon">📊</span>
          <h3>Interpret Data</h3>
          <p>Analyze simulation results and discover biological patterns</p>
        </div>
      </div>
    </div>
  )
}
```

### 3. **Model Browser** (REAL Cell Collective Models)

```typescript
const ModelBrowser = () => {
  const [models, setModels] = useState([]);
  const api = new CellCollectiveAPI();

  useEffect(() => {
    api.getModels().then(setModels);
  }, []);

  return (
    <div>
      <h2>📚 Browse Biological Models</h2>
      <div className="models-grid">
        {models.map(model => (
          <div key={model.id} className="model-card">
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <span className="badge">{model.targetAudience}</span>
            <button onClick={() => loadModel(model.id)}>
              Open Model
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. **Model Builder** (Wrap Cell Collective's Editor)

```typescript
const ModelBuilder = ({ modelId }) => {
  const [model, setModel] = useState(null);
  const [components, setComponents] = useState([]);

  // Load actual Cell Collective model
  useEffect(() => {
    api.getModel(modelId).then(data => {
      setModel(data);
      setComponents(data.components);
    });
  }, [modelId]);

  return (
    <div>
      <h2>🔬 Build Your Model: {model?.name}</h2>

      {/* Component Palette - K-12 Friendly */}
      <div className="component-palette">
        <h3>🧩 Add Components</h3>
        <div className="components-list">
          <button onClick={() => addComponent('gene')}>
            🧬 Gene
          </button>
          <button onClick={() => addComponent('protein')}>
            🔵 Protein
          </button>
          <button onClick={() => addComponent('receptor')}>
            📡 Receptor
          </button>
        </div>
      </div>

      {/* Canvas - Shows actual model structure */}
      <div className="model-canvas">
        {components.map(comp => (
          <div key={comp.id} className="component">
            {comp.name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎨 K-12 Design Principles

### Keep from Current Design ✅
- Beautiful gradient colors
- Smooth animations
- Card-based layouts
- Friendly emoji icons
- Glass morphism header

### Change to Wrap Cell Collective 🔄
- Replace fake models with **real API data**
- Match Cell Collective's **3 core features**
- Use Cell Collective's **actual model structure**
- Connect to Cell Collective's **simulation engine**
- Show Cell Collective's **real educational content**

---

## 📋 Implementation Roadmap

### Phase 1: API Discovery (Today)
- [x] Confirm `/web/_api/initialize` works
- [ ] Find endpoint for listing models
- [ ] Find endpoint for loading model details
- [ ] Find endpoint for running simulations
- [ ] Document authentication requirements

### Phase 2: Core Integration (2-3 days)
- [ ] Build `CellCollectiveAPI` class
- [ ] Test fetching real models
- [ ] Test loading model structure
- [ ] Test running simulations
- [ ] Handle errors and edge cases

### Phase 3: UI Rebuild (3-4 days)
- [ ] Rebuild Dashboard (3 features: Build, Design, Interpret)
- [ ] Rebuild Model Browser (real models from API)
- [ ] Build Experiment Designer (simulation params)
- [ ] Build Results Viewer (simulation output)
- [ ] Add K-12 explanations and help text

### Phase 4: Polish & Test (1-2 days)
- [ ] Test with real Cell Collective data
- [ ] Ensure all API calls work
- [ ] Add loading states and error handling
- [ ] Validate K-12 appropriateness
- [ ] Screenshot the REAL working wrapper

**Total Time:** 1 week for working prototype

---

## 🔍 Next Immediate Steps

1. **Find Model List Endpoint**
   - Try: `GET /web/_api/models`
   - Or: Browse Cell Collective site with DevTools to find endpoint

2. **Test Authentication**
   - Check if model access requires login
   - Determine if we can use anonymous access for K-12

3. **Map Cell Collective Features**
   - Document how "Build Models" works in Cell Collective
   - Document how "Design Experiments" works
   - Document how "Interpret Data" works

4. **Start Rebuild**
   - Create `src/api/cellCollective.ts`
   - Update Dashboard to show 3 real features
   - Connect Model Browser to real API

---

## ✅ Success Criteria

The wrapper is correct when:
- ✅ Dashboard shows Cell Collective's 3 features (Build, Design, Interpret)
- ✅ Model Browser displays REAL models from Cell Collective API
- ✅ Model Builder loads actual Cell Collective model structure
- ✅ Simulations run on Cell Collective's real simulation engine
- ✅ Results show data from Cell Collective, presented in K-12-friendly way
- ✅ All features connect to research.cellcollective.org APIs
- ✅ NO fake data, NO sample models, everything is REAL

---

**Status:** Ready to build the CORRECT wrapper! 🚀
