# Cell Collective Import File Types

## Investigation Results

**Date:** 2025-11-03
**Question:** What file types can be imported into Cell Collective for logical models?

---

## 🔍 Technical Discovery

### File Input Configuration
Found 3 file input elements on model creation page:
```javascript
{
  "name": "fileImportInput",
  "accept": "",  // Empty - no HTML restriction
  "multiple": true,  // Can upload multiple files
  "className": "",
  "parent": ""
}
```

**Key Finding:** The `accept` attribute is empty, meaning no client-side file type restriction. Backend validation likely enforces specific formats.

---

## 📁 Likely Supported Formats

Based on Cell Collective being a **biological network modeling platform**, these formats are typically supported:

### 1. **SBML** (Systems Biology Markup Language) ⭐ MOST LIKELY
- **Extensions:** `.xml`, `.sbml`
- **Standard:** Industry-wide standard for biological models
- **Use:** Widely used for cell signaling, metabolic networks
- **Probability:** 95% - This is the standard format

### 2. **Cell Collective JSON Format**
- **Extension:** `.json`
- **Standard:** Cell Collective's proprietary format
- **Use:** Native format for Cell Collective models
- **Probability:** 90% - Native platform format

### 3. **GINsim Format**
- **Extension:** `.zginml`, `.ginml`
- **Standard:** GINsim (Gene Interaction Network simulation)
- **Use:** Qualitative/Boolean regulatory networks
- **Probability:** 70% - Common for Boolean networks

### 4. **BNGL** (BioNetGen Language)
- **Extension:** `.bngl`
- **Standard:** Rule-based modeling
- **Use:** Biochemical reaction networks
- **Probability:** 60% - For complex interactions

### 5. **Boolean Network Text Files**
- **Extensions:** `.txt`, `.csv`, `.tsv`
- **Format:** Simple text format with rules
- **Example:**
  ```
  Gene_A = Gene_B AND NOT Gene_C
  Gene_B = Gene_A OR Gene_D
  ```
- **Probability:** 80% - Simple, educational

### 6. **CellML**
- **Extension:** `.cellml`
- **Standard:** Cell Markup Language
- **Use:** Mathematical models of cells
- **Probability:** 40% - Less common for Boolean networks

### 7. **BioPAX**
- **Extension:** `.owl`, `.xml`
- **Standard:** Biological Pathway Exchange
- **Use:** Pathway data exchange
- **Probability:** 30% - More for pathway databases

---

## 🎯 Most Likely Answer

**Top 3 formats Cell Collective probably accepts:**
1. **SBML** (.xml, .sbml) - 95% confidence
2. **JSON** (.json) - 90% confidence (native format)
3. **Boolean Network TXT/CSV** (.txt, .csv) - 80% confidence

**Recommendation for wrapper:** Support these 3 formats initially, then expand based on testing.

---

## 🔬 How to Verify

### Method 1: Test Import (Manual)
1. Go to research.cellcollective.org
2. Sign in (required for model creation)
3. Navigate to: New Model → Logical Model → Import
4. Try uploading different file types
5. Note which ones are accepted/rejected

### Method 2: Network Analysis
```javascript
// When you upload a file, watch the network request:
POST https://research.cellcollective.org/web/_api/model/import
Content-Type: multipart/form-data

// The response will show:
// - Accepted file types
// - Error messages for rejected types
// - Validation rules
```

### Method 3: Documentation Search
- Check Cell Collective documentation
- Look for API documentation
- Search for "import", "SBML", "file format"

---

## 📊 For Your K-12 Wrapper

### Simplification Strategy

**Instead of file imports (too complex for K-12):**

1. **Template-Based Creation**
   - Provide pre-made model templates
   - "Start with: Cell Cycle, Ecosystem, Disease"
   - No file uploads needed

2. **Simple Visual Builder**
   - Drag-and-drop components
   - No need to understand file formats
   - Export to JSON behind the scenes

3. **Load from Library**
   - Browse pre-made models
   - Click to load and modify
   - No import functionality exposed

**Recommendation:** For K-12 wrapper, HIDE the import functionality entirely. It's too technical and not needed for educational use.

---

## 🚀 Next Steps

1. **Manual Testing:** Sign in to Cell Collective and test import
2. **API Documentation:** Look for official docs on file formats
3. **Simplify for K-12:** Focus on templates, not imports
4. **Export Support:** Let kids export their models (JSON) for sharing

---

## 📝 Notes

- Import functionality requires authentication (sign-in)
- Multiple file upload supported (batch import)
- No client-side validation (backend handles it)
- For K-12, better to avoid file import complexity

**Status:** Need manual testing to confirm exact formats accepted.
