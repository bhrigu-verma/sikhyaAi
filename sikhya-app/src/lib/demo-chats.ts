export interface DemoChat {
  id: string;
  subject: string;
  classNum: number;
  chapter: string;
  question: string;
  answer: string;
  tag: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export const DEMO_CHATS: DemoChat[] = [
  {
    id: 'demo-1',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 8 — How do Organisms Reproduce?',
    tag: '🧬 Biology',
    question: 'DNA ਦੀ ਨਕਲ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ ਅਤੇ ਇਹ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ? ਕੀ ਨਕਲ ਵਿੱਚ ਗਲਤੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ?',
    answer: `## DNA ਦੀ ਨਕਲ (DNA Replication) — PSEB Class 10, Ch. 8, Page 143

**ਨਕਲ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ?**

ਜਦੋਂ ਕੋਈ ਜੀਵ ਆਪਣੇ ਵਰਗੀ ਔਲਾਦ ਪੈਦਾ ਕਰਦਾ ਹੈ, ਤਾਂ ਉਸਨੂੰ ਆਪਣੀ ਜੈਨੇਟਿਕ ਜਾਣਕਾਰੀ ਅਗਲੀ ਪੀੜ੍ਹੀ ਨੂੰ ਦੇਣੀ ਪੈਂਦੀ ਹੈ। ਇਹ ਜਾਣਕਾਰੀ DNA ਵਿੱਚ ਸਟੋਰ ਹੁੰਦੀ ਹੈ। ਇਸ ਲਈ **ਸੈੱਲ ਵੰਡ ਤੋਂ ਪਹਿਲਾਂ DNA ਦੀ ਸਹੀ ਨਕਲ** ਬਣਾਉਣਾ ਜ਼ਰੂਰੀ ਹੈ।

---

**ਨਕਲ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ?**

DNA ਦੋ ਲੜੀਆਂ (double helix) ਤੋਂ ਬਣਿਆ ਹੁੰਦਾ ਹੈ:

1. **ਲੜੀਆਂ ਵੱਖ ਹੁੰਦੀਆਂ ਹਨ** — ਵਿਸ਼ੇਸ਼ ਐਨਜ਼ਾਈਮ (enzyme) DNA ਦੀਆਂ ਦੋਵੇਂ ਲੜੀਆਂ ਨੂੰ ਖੋਲ੍ਹਦੇ ਹਨ
2. **ਨਵੀਂ ਲੜੀ ਬਣਦੀ ਹੈ** — ਹਰੇਕ ਪੁਰਾਣੀ ਲੜੀ ਉੱਤੇ ਨਵੇਂ ਨਾਈਟ੍ਰੋਜਨ ਬੇਸ ਜੁੜਦੇ ਹਨ (A-T, G-C ਨਿਯਮ ਅਨੁਸਾਰ)
3. **ਦੋ ਨਵੇਂ DNA ਬਣਦੇ ਹਨ** — ਇੱਕ-ਇੱਕ ਪੁਰਾਣੀ ਲੜੀ ਅਤੇ ਇੱਕ-ਇੱਕ ਨਵੀਂ ਲੜੀ ਵਾਲੇ ਦੋ DNA

> 📌 **PSEB ਪਾਠ-ਪੁਸਤਕ ਦਾ ਅਸਲ ਬਿੰਦੂ:** "DNA copying is not perfect and the errors that occur during copying introduce variations."

---

**ਕੀ ਗਲਤੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ? — ਹਾਂ! ਅਤੇ ਇਹ ਜ਼ਰੂਰੀ ਵੀ ਹੈ**

| ਕੀ ਹੁੰਦਾ ਹੈ | ਨਤੀਜਾ |
|---|---|
| ਨਕਲ ਸਹੀ ਹੋਵੇ | ਔਲਾਦ ਬਿਲਕੁਲ ਮਾਂ-ਬਾਪ ਵਰਗੀ |
| ਛੋਟੀ ਗਲਤੀ ਹੋਵੇ | **Variation** — ਥੋੜਾ ਵੱਖਰਾਪਣ |
| ਵੱਡੀ ਗਲਤੀ ਹੋਵੇ | ਜੀਵ ਜਿਉਂਦਾ ਨਹੀਂ ਰਹਿੰਦਾ |

ਇਹੀ **variations** (ਪਰਿਵਰਤਨ) ਹੀ Evolution (ਵਿਕਾਸ) ਦੀ ਬੁਨਿਆਦ ਹਨ।

> 🎯 **PYQ Alert:** ਇਹ ਸਵਾਲ 2019 ਅਤੇ 2022 ਦੇ PSEB board exam ਵਿੱਚ 3 ਅੰਕਾਂ ਲਈ ਆਇਆ ਸੀ।`,
  },

  {
    id: 'demo-2',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 12 — Electricity',
    tag: '⚡ Physics',
    question: 'Ohm\'s Law derive karo aur batao ki yeh kab fail hota hai — with PSEB examples',
    answer: `## Ohm's Law — Derivation + Limitations
### PSEB Class 10 Physics, Chapter 12

---

### 📖 Statement (As in PSEB Textbook, Page 200)

> *"The current through a conductor between two points is directly proportional to the voltage across the two points."*

**Mathematical Form:**
$$V \\propto I$$
$$V = IR$$

Where:
- **V** = Potential Difference (Voltage) in Volts (V)
- **I** = Current in Amperes (A)
- **R** = Resistance in Ohms (Ω) — the constant of proportionality

---

### 🔬 Derivation Logic (How we arrive at this)

**Step 1:** Experiment — Take a resistor, ammeter (in series), voltmeter (in parallel).

**Step 2:** Vary the voltage using a rheostat. For each V, record I.

| V (Volts) | I (Amperes) | V/I |
|---|---|---|
| 1.0 | 0.2 | 5 Ω |
| 2.0 | 0.4 | 5 Ω |
| 3.0 | 0.6 | 5 Ω |

**Step 3:** V/I = constant → This constant is **Resistance (R)**

Therefore: **V = IR** ✅

---

### ❌ When Ohm's Law FAILS (Non-Ohmic Conductors)

This is what ChatGPT often gets wrong — it forgets PSEB only asks about these specific cases:

| Device | Why it fails |
|---|---|
| **Diode (p-n junction)** | Current only in one direction — not proportional |
| **Filament Bulb (Tungsten)** | Resistance changes with temperature |
| **Electrolyte solutions** | Complex ion movement |
| **Thermistor** | Resistance drops as temperature rises |

> ✅ **PSEB Board Tip:** In graph questions, an Ohmic conductor gives a **straight line** through origin. Non-Ohmic gives a **curve**.

> 🎯 **PYQ (2023 PSEB):** "Draw V-I graph for (a) Ohmic conductor (b) Non-Ohmic conductor" — 2 marks`,
  },

  {
    id: 'demo-3',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 6 — Life Processes',
    tag: '🌿 Biology',
    question: 'ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ (Photosynthesis) ਦੀ ਪੂਰੀ ਪ੍ਰਕਿਰਿਆ ਸਮਝਾਓ। ਪੱਤੇ ਦੀ ਬਣਤਰ ਨਾਲ ਕਿਵੇਂ ਜੁੜੀ ਹੈ?',
    answer: `## ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ (Photosynthesis)
### PSEB Class 10 Biology, Ch. 6, Pages 95–99

---

### ਰਸਾਇਣਿਕ ਸਮੀਕਰਣ (Chemical Equation)

$$6CO_2 + 6H_2O \\xrightarrow{\\text{ਸੂਰਜ ਦੀ ਰੌਸ਼ਨੀ}} C_6H_{12}O_6 + 6O_2$$

ਕਾਰਬਨ ਡਾਈਆਕਸਾਈਡ + ਪਾਣੀ → **ਗਲੂਕੋਜ਼ + ਆਕਸੀਜਨ**

---

### ਪ੍ਰਕਿਰਿਆ ਦੇ ਤਿੰਨ ਪੜਾਅ

**1. ਰੌਸ਼ਨੀ ਦੀ ਲੋੜ (Light Dependent Reactions)**
- ਕਲੋਰੋਫਿਲ ਸੂਰਜ ਦੀ ਊਰਜਾ ਫੜਦਾ ਹੈ
- ਪਾਣੀ ਦੇ ਅਣੂ ਟੁੱਟਦੇ ਹਨ (Photolysis) → O₂ ਬਾਹਰ ਨਿਕਲਦੀ ਹੈ
- ATP ਅਤੇ NADPH ਬਣਦੇ ਹਨ (ਊਰਜਾ ਭੰਡਾਰ)

**2. ਕਾਰਬਨ ਫਿਕਸੇਸ਼ਨ (Dark Reactions / Calvin Cycle)**
- CO₂ ਪੱਤਿਆਂ ਦੇ ਸਟੋਮਾਟਾ ਰਾਹੀਂ ਅੰਦਰ ਆਉਂਦੀ ਹੈ
- ATP ਦੀ ਊਰਜਾ ਵਰਤ ਕੇ CO₂ → ਗਲੂਕੋਜ਼ ਬਣਦੀ ਹੈ

---

### ਪੱਤੇ ਦੀ ਬਣਤਰ ਅਤੇ ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ ਦਾ ਸੰਬੰਧ

| ਪੱਤੇ ਦਾ ਭਾਗ | ਭੂਮਿਕਾ |
|---|---|
| **Cuticle (ਮੋਮੀ ਪਰਤ)** | ਪਾਣੀ ਨੂੰ ਬਾਹਰ ਜਾਣ ਤੋਂ ਰੋਕਦੀ ਹੈ |
| **Stomata (ਰੰਧਰ)** | CO₂ ਅੰਦਰ, O₂ ਬਾਹਰ — ਗੈਸ ਆਦਾਨ-ਪ੍ਰਦਾਨ |
| **Palisade Cells** | ਕਲੋਰੋਫਿਲ ਨਾਲ ਭਰੇ — ਮੁੱਖ ਪ੍ਰਕਾਸ਼ ਸੰਸਲੇਸ਼ਣ ਇੱਥੇ |
| **Vascular Bundle (ਨਾੜੀਆਂ)** | Xylem → ਪਾਣੀ ਲਿਆਉਂਦਾ; Phloem → ਗਲੂਕੋਜ਼ ਲੈ ਜਾਂਦਾ |

> 🔑 **ਯਾਦ ਰੱਖਣ ਵਾਲੀ ਗੱਲ:** ਪੱਤਿਆਂ ਦਾ ਚਪਟਾ ਆਕਾਰ → ਵੱਧ ਤੋਂ ਵੱਧ ਰੌਸ਼ਨੀ ਫੜਨ ਲਈ। ਇਹ PSEB ਦਾ ਸਭ ਤੋਂ ਆਮ MCQ ਪੁਆਇੰਟ ਹੈ।`,
  },

  {
    id: 'demo-4',
    subject: 'Math',
    classNum: 10,
    chapter: 'Ch. 4 — Quadratic Equations',
    tag: '📐 Algebra',
    question: 'Quadratic Formula kaise aata hai? Completing the square method se step by step prove karo',
    answer: `## Quadratic Formula — Complete Derivation
### PSEB Class 10 Mathematics, Chapter 4

This is where most students just memorize the formula. Sikhya shows you *where it comes from* — so you never forget it.

---

### Starting Point

General quadratic equation:
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

---

### Step-by-Step Derivation (Completing the Square)

**Step 1:** Divide everything by **a**
$$x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0$$

**Step 2:** Move the constant to the right side
$$x^2 + \\frac{b}{a}x = -\\frac{c}{a}$$

**Step 3:** Add $\\left(\\frac{b}{2a}\\right)^2$ to BOTH sides
$$x^2 + \\frac{b}{a}x + \\left(\\frac{b}{2a}\\right)^2 = -\\frac{c}{a} + \\frac{b^2}{4a^2}$$

**Step 4:** Left side is now a perfect square
$$\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}$$

**Step 5:** Take square root of both sides
$$x + \\frac{b}{2a} = \\pm\\frac{\\sqrt{b^2 - 4ac}}{2a}$$

**Step 6:** Solve for x
$$\\boxed{x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}}$$

---

### The Discriminant (ਵਿਭੇਦਕ) — D = b² − 4ac

| D ਦੀ ਕੀਮਤ | ਮੂਲਾਂ ਦੀ ਪ੍ਰਕਿਰਤੀ |
|---|---|
| **D > 0** | 2 ਅਸਲ ਅਤੇ ਵੱਖਰੇ ਮੂਲ |
| **D = 0** | 2 ਬਰਾਬਰ ਅਸਲ ਮੂਲ |
| **D < 0** | ਕੋਈ ਅਸਲ ਮੂਲ ਨਹੀਂ |

> ✅ **PSEB Board Question Pattern:** "Find the nature of roots of 2x² − 4x + 2 = 0"
> D = 16 − 16 = 0 → Equal roots → x = 1 (both roots)

> 🎯 **PYQ (2022 PSEB):** Full derivation was asked for 5 marks. A student who only memorizes the formula cannot answer this.`,
  },

  {
    id: 'demo-5',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 4 — Carbon and its Compounds',
    tag: '⚗️ Chemistry',
    question: 'Carbon covalent bonds ਕਿਉਂ ਬਣਾਉਂਦਾ ਹੈ ionic ਕਿਉਂ ਨਹੀਂ? ਅਤੇ Tetravalency ਦਾ ਕੀ ਮਹੱਤਵ ਹੈ?',
    answer: `## Carbon ਦੀਆਂ ਵਿਸ਼ੇਸ਼ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ
### PSEB Chemistry, Ch. 4, Pages 61–65

---

### ਕਾਰਬਨ Ionic Bond ਕਿਉਂ ਨਹੀਂ ਬਣਾਉਂਦਾ?

Ionic bond ਲਈ ਇੱਕ ਪਰਮਾਣੂ ਇਲੈਕਟ੍ਰੌਨ ਦਿੰਦਾ ਅਤੇ ਦੂਜਾ ਲੈਂਦਾ ਹੈ।

**Carbon ਕੋਲ ਸਮੱਸਿਆ:**

| ਕੀ ਚਾਹੀਦਾ | ਮੁਸ਼ਕਲ |
|---|---|
| 4 ਇਲੈਕਟ੍ਰੌਨ ਦੇਣ (C⁴⁺ ਬਣਨ ਲਈ) | ਬਹੁਤ ਵੱਧ ਊਰਜਾ ਚਾਹੀਦੀ — ਸੰਭਵ ਨਹੀਂ |
| 4 ਇਲੈਕਟ੍ਰੌਨ ਲੈਣ (C⁴⁻ ਬਣਨ ਲਈ) | ਨਿਊਕਲੀਅਸ ਇੰਨਾ ਕਮਜ਼ੋਰ ਨਹੀਂ ਕਿ 10 ਇਲੈਕਟ੍ਰੌਨ ਰੱਖ ਸਕੇ |

**ਹੱਲ:** Carbon **ਸਾਂਝੇ ਜੋੜੇ (Shared Pairs)** ਬਣਾਉਂਦਾ ਹੈ — ਇਹੀ Covalent Bond ਹੈ।

---

### Tetravalency (ਚਤੁਰ-ਯੋਜਕਤਾ) — Carbon ਦੀ ਸ਼ਕਤੀ

Carbon ਦੀ ਇਲੈਕਟ੍ਰੌਨ ਬਣਤਰ: **2, 4** → ਬਾਹਰੀ ਕੱਖ਼ੇ ਵਿੱਚ 4 ਇਲੈਕਟ੍ਰੌਨ

ਇਸ ਕਰਕੇ Carbon:
- **4 covalent bonds** ਬਣਾ ਸਕਦਾ ਹੈ
- ਆਪਣੇ ਨਾਲ ਹੋਰ Carbon ਨਾਲ ਜੁੜ ਸਕਦਾ ਹੈ (Catenation)
- **ਲੱਖਾਂ ਮਿਸ਼ਰਣ** ਬਣਾ ਸਕਦਾ ਹੈ

---

### Catenation — ਕਾਰਬਨ ਦੀ ਅਨੋਖੀ ਸ਼ਕਤੀ

\`\`\`
H   H   H
|   |   |
H—C—C—C—H     (Propane — C₃H₈)
|   |   |
H   H   H
\`\`\`

ਕਾਰਬਨ ਸਿੱਧੀਆਂ ਲੜੀਆਂ, ਸ਼ਾਖਾਵਾਂ, ਅਤੇ ਰਿੰਗਾਂ ਬਣਾ ਸਕਦਾ ਹੈ। **ਜ਼ਿੰਦਗੀ ਦਾ ਆਧਾਰ ਹੀ Carbon ਹੈ।**

> 📌 PSEB ਵਿੱਚ ਇਹ ਸਵਾਲ ਹਮੇਸ਼ਾ ਆਉਂਦਾ ਹੈ: "Why does carbon form covalent bonds and not ionic bonds?" — 3 marks`,
  },

  {
    id: 'demo-6',
    subject: 'Math',
    classNum: 10,
    chapter: 'Ch. 11 — Constructions',
    tag: '📏 Geometry',
    question: 'Tangent to a circle from an external point — proof that the two tangents are equal in length',
    answer: `## Theorem: Tangents from External Point are Equal
### PSEB Class 10 Mathematics, Chapter 11

This is a **must-prove theorem** — asked in PSEB Board exams almost every year.

---

### Theorem Statement (PSEB Textbook, Page 214)

> "The lengths of tangents drawn from an external point to a circle are equal."

---

### Given, To Prove, Construction

**Given:**
- Circle with centre O
- External point P
- PA and PB are tangents from P touching circle at A and B

**To Prove:** PA = PB

**Construction:** Draw OA, OB, and OP

---

### Proof

In △OAP and △OBP:

| Statement | Reason |
|---|---|
| OA = OB | Both are radii of same circle |
| OP = OP | Common side |
| ∠OAP = ∠OBP = 90° | Radius ⊥ tangent at point of contact |

**By RHS Congruence:** △OAP ≅ △OBP

Therefore: **PA = PB** (CPCT) ✅

---

### Why ∠OAP = 90°? (Students often forget to justify this)

A tangent to a circle is **perpendicular to the radius** at the point of contact. This is itself a theorem (PSEB Ch. 11, Theorem 10.1). In exam, write: "By theorem, radius ⊥ tangent → ∠OAP = 90°"

---

### Corollary (ਉੱਪ-ਸਿੱਧਾਂਤ) — Often asked separately

**OP bisects angle APB** and **OP bisects angle AOB**

(Because △OAP ≅ △OBP → all corresponding angles equal → ∠APO = ∠BPO)

> 🎯 **PSEB 2023:** "Prove that tangents from external point are equal. Also find PA if OP = 13cm and radius = 5cm."
> Solution: PA² = OP² − OA² = 169 − 25 = 144 → **PA = 12 cm**`,
  },

  {
    id: 'demo-7',
    subject: 'SST',
    classNum: 10,
    chapter: 'Ch. 1 — The Rise of Nationalism in Europe',
    tag: '🌍 History',
    question: 'ਫ਼੍ਰੈਂਚ ਕ੍ਰਾਂਤੀ ਅਤੇ Nationalism ਦਾ ਕੀ ਸੰਬੰਧ ਹੈ? ਯੂਰਪ ਵਿੱਚ Nationalism ਕਿਵੇਂ ਫੈਲਿਆ?',
    answer: `## ਰਾਸ਼ਟਰਵਾਦ ਦਾ ਉਭਾਰ (Rise of Nationalism in Europe)
### PSEB Class 10 SST, Ch. 1, Pages 3–18

---

### ਫ਼੍ਰੈਂਚ ਕ੍ਰਾਂਤੀ (1789) — Nationalism ਦਾ ਜਨਮ ਸਥਾਨ

ਫ਼੍ਰੈਂਚ ਕ੍ਰਾਂਤੀ ਤੋਂ ਪਹਿਲਾਂ: ਰਾਜ = ਰਾਜੇ ਦੀ ਜਾਇਦਾਦ। ਲੋਕ = ਪਰਜਾ।

**ਕ੍ਰਾਂਤੀ ਨੇ ਕੀ ਬਦਲਿਆ?**

1. **ਰਾਸ਼ਟਰ ਦੀ ਧਾਰਨਾ:** ਰਾਜ ਹੁਣ ਰਾਜੇ ਦਾ ਨਹੀਂ, **ਲੋਕਾਂ ਦਾ** ਹੋਵੇਗਾ
2. **La Patrie + Le Citoyen:** "ਮਾਤਭੂਮੀ" ਅਤੇ "ਨਾਗਰਿਕ" ਦੀ ਧਾਰਨਾ ਉੱਭਰੀ
3. **ਫ਼ਰਾਂਸੀਸੀ ਝੰਡਾ:** Tricolour ਰਾਸ਼ਟਰੀ ਏਕਤਾ ਦਾ ਚਿੰਨ੍ਹ ਬਣਿਆ
4. **ਸੰਵਿਧਾਨ:** ਨਾਗਰਿਕਾਂ ਦੇ ਅਧਿਕਾਰਾਂ ਦੀ ਗਾਰੰਟੀ

---

### ਨੈਪੋਲੀਅਨ — Nationalism ਦਾ ਫੈਲਾਅ (1799–1815)

> 📌 **PSEB Textbook Quote (Page 7):** "Napoleon had, no doubt, destroyed democracy in France, but in the administrative field he had incorporated revolutionary principles in order to make the whole system more rational and efficient."

**ਨੈਪੋਲੀਅਨ ਦੇ ਕੰਮ:**

| ਸੁਧਾਰ | ਮਹੱਤਵ |
|---|---|
| Napoleonic Code (1804) | ਕਾਨੂੰਨ ਸਭ ਲਈ ਬਰਾਬਰ |
| Feudal system ਖ਼ਤਮ | ਕਿਸਾਨ ਆਜ਼ਾਦ |
| Uniform weights & measures | ਵਪਾਰ ਸੁਵਿਧਾ |
| ਗਿਲਡ ਪ੍ਰਥਾ ਖ਼ਤਮ | ਦਸਤਕਾਰ ਆਜ਼ਾਦ |

---

### ਯੂਰਪ ਵਿੱਚ Nationalism ਫੈਲਣ ਦੇ ਕਾਰਨ

1. **Romanticism ਲਹਿਰ** — ਕਵੀਆਂ ਅਤੇ ਸੰਗੀਤਕਾਰਾਂ ਨੇ ਰਾਸ਼ਟਰੀ ਭਾਵਨਾਵਾਂ ਜਗਾਈਆਂ
2. **ਸਾਂਝੀ ਭਾਸ਼ਾ** — ਛਾਪੇਖ਼ਾਨੇ ਕਾਰਨ ਭਾਸ਼ਾਈ ਏਕਤਾ ਆਈ
3. **Vienna Congress (1815)** — ਲੋਕਾਂ ਦੀ ਇੱਛਾ ਦਬਾਈ → ਵਿਰੋਧ ਵਧਿਆ
4. **1848 ਦੀਆਂ ਕ੍ਰਾਂਤੀਆਂ** — "Spring of Nations" — ਪੂਰਾ ਯੂਰਪ ਕੰਬਿਆ

> 🎯 **PSEB PYQ (2022) 5 marks:** "How did the French Revolution contribute to the growth of nationalism in Europe?"`,
  },

  {
    id: 'demo-8',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 9 — Heredity and Evolution',
    tag: '🔬 Genetics',
    question: 'Mendel\'s pea plant experiment — ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਔਲਾਦ ਦੇ ਅਨੁਪਾਤ 3:1 ਕਿਉਂ ਆਉਂਦੇ ਹਨ?',
    answer: `## ਮੈਂਡਲ ਦਾ ਮਟਰ ਪ੍ਰਯੋਗ — Monohybrid Cross
### PSEB Class 10 Biology, Ch. 9, Pages 158–162

---

### ਪ੍ਰਯੋਗ ਦਾ ਆਧਾਰ

ਮੈਂਡਲ ਨੇ ਮਟਰ ਦੇ ਪੌਦਿਆਂ ਦੀ ਚੁਣੀ — ਕਾਰਨ:
- ਸ਼ੁੱਧ ਨਸਲਾਂ (True breeding varieties) ਮਿਲਦੀਆਂ ਸਨ
- ਇੱਕ ਸਾਲ ਵਿੱਚ ਕਈ ਪੀੜ੍ਹੀਆਂ ਦੇਖ ਸਕਦੇ ਸੀ
- ਆਸਾਨੀ ਨਾਲ Cross-pollination ਕਰ ਸਕਦੇ ਸੀ

---

### Monohybrid Cross — ਰੰਗ (ਲਾਲ ਬਨਾਮ ਚਿੱਟਾ)

**ਮਾਪੇ (P₁):**
- ਲਾਲ ਫੁੱਲ ਵਾਲਾ ਪੌਦਾ (RR) × ਚਿੱਟੇ ਫੁੱਲ ਵਾਲਾ (rr)

**ਪਹਿਲੀ ਔਲਾਦ (F₁):**
\`\`\`
R  R
r  Rr  Rr    → ਸਾਰੇ ਲਾਲ (100%)
r  Rr  Rr
\`\`\`
**ਨਤੀਜਾ:** ਸਾਰੇ ਲਾਲ → ਲਾਲ ਰੰਗ Dominant (ਪ੍ਰਭਾਵੀ) ਹੈ

---

**F₁ × F₁ (ਪਹਿਲੀ ਔਲਾਦ ਦਾ ਆਪਸ ਵਿੱਚ ਮੇਲ):**

\`\`\`
      R         r
R    RR (ਲਾਲ)  Rr (ਲਾਲ)
r    Rr (ਲਾਲ)  rr (ਚਿੱਟਾ)
\`\`\`

**F₂ ਔਲਾਦ:**
- 3 ਲਾਲ (RR + Rr + Rr)
- 1 ਚਿੱਟਾ (rr)
- **ਅਨੁਪਾਤ = 3:1** ✅

---

### 3:1 ਕਿਉਂ? — ਸਮਝਣ ਦਾ ਤਰੀਕਾ

ਅਸਲ ਵਿੱਚ Genotype ਅਨੁਪਾਤ ਹੈ **1:2:1** (RR : Rr : rr)
- RR ਅਤੇ Rr — ਦੋਵੇਂ ਲਾਲ ਦਿਖਦੇ ਹਨ (R Dominant ਹੈ)
- rr — ਸਿਰਫ਼ ਚਿੱਟਾ

ਇਸ ਲਈ **Phenotype ਅਨੁਪਾਤ = 3 ਲਾਲ : 1 ਚਿੱਟਾ**

> 📌 **ਮਹੱਤਵਪੂਰਨ ਸ਼ਬਦ:**
> - **Dominant (ਪ੍ਰਭਾਵੀ):** ਜੋ F₁ ਵਿੱਚ ਦਿਖਦਾ ਹੈ
> - **Recessive (ਅਪ੍ਰਭਾਵੀ):** ਜੋ F₁ ਵਿੱਚ ਲੁਕਦਾ ਅਤੇ F₂ ਵਿੱਚ ਦੁਬਾਰਾ ਆਉਂਦਾ ਹੈ
> - **Genotype:** ਜੀਨ ਬਣਤਰ (RR, Rr, rr)
> - **Phenotype:** ਬਾਹਰੀ ਦਿੱਖ (ਲਾਲ/ਚਿੱਟਾ)

> 🎯 **PSEB Board (2021, 2023):** Punnett square draw karna + ratio explain karna — 5 marks`,
  },

  {
    id: 'demo-9',
    subject: 'Math',
    classNum: 10,
    chapter: 'Ch. 15 — Probability',
    tag: '🎲 Statistics',
    question: 'Probability vs Experimental Probability — ਦੋਵਾਂ ਵਿੱਚ ਫ਼ਰਕ ਅਤੇ PSEB ਦੇ ਨਜ਼ਰੀਏ ਤੋਂ ਉਦਾਹਰਨਾਂ',
    answer: `## Theoretical vs Experimental Probability
### PSEB Class 10 Mathematics, Chapter 15

---

### ਦੋ ਕਿਸਮਾਂ ਦੀ Probability

| | Theoretical (ਸਿਧਾਂਤਕ) | Experimental (ਪ੍ਰਯੋਗਾਤਮਕ) |
|---|---|---|
| **ਆਧਾਰ** | ਗਣਨਾ | ਅਸਲ ਪ੍ਰਯੋਗ |
| **ਫਾਰਮੂਲਾ** | P(E) = n(E)/n(S) | P(E) = ਹੋਈਆਂ ਵਾਰਾਂ / ਕੁੱਲ ਵਾਰਾਂ |
| **ਉਦਾਹਰਨ** | ਸਿੱਕਾ ਸੁੱਟਣ ਤੇ Head = 1/2 | 100 ਵਾਰ ਸੁੱਟਿਆ, 47 ਵਾਰ Head ਆਇਆ |
| **ਜ਼ਰੂਰਤ** | ਕੋਈ ਪ੍ਰਯੋਗ ਨਹੀਂ | ਅਸਲ ਡੇਟਾ ਜ਼ਰੂਰੀ |

---

### PSEB-Style ਪ੍ਰਸ਼ਨ ਅਤੇ ਹੱਲ

**Q1 (MCQ Type):** ਇੱਕ ਡਾਈਸ ਸੁੱਟਿਆ ਜਾਂਦਾ ਹੈ। P(prime number ਆਵੇਗਾ) = ?

**ਹੱਲ:**
- Sample Space S = {1, 2, 3, 4, 5, 6}, n(S) = 6
- Prime numbers E = {2, 3, 5}, n(E) = 3
- **P(E) = 3/6 = 1/2** ✅

---

**Q2 (Story Problem):** ਇੱਕ ਥੈਲੇ ਵਿੱਚ 3 ਲਾਲ, 5 ਚਿੱਟੀਆਂ, 2 ਕਾਲੀਆਂ ਗੋਲੀਆਂ ਹਨ। ਇੱਕ ਗੋਲੀ ਕੱਢੀ। ਹਿਸਾਬ ਲਗਾਓ:

- P(ਲਾਲ) = 3/10
- P(ਚਿੱਟੀ) = 5/10 = **1/2**
- P(ਕਾਲੀ ਨਹੀਂ) = (3+5)/10 = **4/5**

> ⚠️ **ਆਮ ਗਲਤੀ:** ਵਿਦਿਆਰਥੀ P(ਕਾਲੀ ਨਹੀਂ) = 1 − P(ਕਾਲੀ) ਨਹੀਂ ਵਰਤਦੇ। ਹਮੇਸ਼ਾ: **P(not E) = 1 − P(E)**

---

### ਯਾਦ ਰੱਖੋ (For PSEB Exam)

1. **0 ≤ P(E) ≤ 1** — Probability ਕਦੇ ਵੀ 0 ਤੋਂ ਘੱਟ ਜਾਂ 1 ਤੋਂ ਵੱਧ ਨਹੀਂ
2. **P(E) + P(E') = 1** — ਕਿਸੇ ਘਟਨਾ ਅਤੇ ਉਸਦੀ ਪੂਰਕ ਘਟਨਾ ਦਾ ਜੋੜ 1 ਹੈ
3. **P(impossible event) = 0**, **P(certain event) = 1**`,
  },

  {
    id: 'demo-10',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 13 — Magnetic Effects of Electric Current',
    tag: '🧲 Physics',
    question: 'Fleming\'s Left Hand Rule and Right Hand Rule — ਦੋਵਾਂ ਵਿੱਚ ਫ਼ਰਕ, ਕਦੋਂ ਕਿਹੜਾ ਵਰਤੀਏ?',
    answer: `## Fleming's Rules — Complete Guide
### PSEB Class 10 Physics, Ch. 13, Pages 224–229

ਇਹ ਸਵਾਲ PSEB ਵਿੱਚ ਹਰ ਸਾਲ ਆਉਂਦਾ ਹੈ ਅਤੇ ਵਿਦਿਆਰਥੀ ਅਕਸਰ ਦੋਵਾਂ ਨੂੰ ਮਿਲਾ ਲੈਂਦੇ ਹਨ।

---

### ਯਾਦ ਰੱਖਣ ਦਾ ਤਰੀਕਾ

| | Fleming's **Left** Hand Rule | Fleming's **Right** Hand Rule |
|---|---|---|
| **ਕਿਸ ਲਈ?** | **Motor** (ਮੋਟਰ) | **Generator** (ਜਨਰੇਟਰ) |
| **ਕੀ ਪਤਾ ਹੈ?** | ਚੁੰਬਕੀ ਖੇਤਰ + ਕਰੰਟ | ਚੁੰਬਕੀ ਖੇਤਰ + ਗਤੀ |
| **ਕੀ ਲੱਭਣਾ?** | ਬਲ ਦੀ ਦਿਸ਼ਾ (Force) | ਕਰੰਟ ਦੀ ਦਿਸ਼ਾ (Induced EMF) |
| **ਯਾਦ ਕਰੋ** | **L**eft = e**L**ectric **m**otor | **R**ight = gene**R**ato**R** |

---

### Fleming's Left Hand Rule (Motor Effect)

**ਤਿੰਨ ਉਂਗਲਾਂ ਦੀ ਭੂਮਿਕਾ:**
- 🖕 **ਵਿਚਕਾਰਲੀ ਉਂਗਲ** = ਕਰੰਟ ਦੀ ਦਿਸ਼ਾ (Current)
- ☝️ **ਤਰਜਨੀ** = ਚੁੰਬਕੀ ਖੇਤਰ (Magnetic Field, B)
- 👍 **ਅੰਗੂਠਾ** = ਬਲ/ਗਤੀ (Force/Motion)

**ਉਦਾਹਰਨ:** ਇਲੈਕਟ੍ਰਿਕ ਮੋਟਰ ਵਿੱਚ ਤਾਰ ਕਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਘੁੰਮੇਗੀ?

---

### Fleming's Right Hand Rule (Generator Effect)

**ਉਹੀ ਤਿੰਨ ਉਂਗਲਾਂ, ਪਰ ਸੱਜੇ ਹੱਥ ਨਾਲ:**
- 🖕 **ਵਿਚਕਾਰਲੀ ਉਂਗਲ** = Induced Current
- ☝️ **ਤਰਜਨੀ** = Magnetic Field
- 👍 **ਅੰਗੂਠਾ** = ਤਾਰ ਦੀ ਗਤੀ (Motion of conductor)

**ਉਦਾਹਰਨ:** ਜਦੋਂ ਤਾਰ ਚੁੰਬਕੀ ਖੇਤਰ ਵਿੱਚ ਹਿਲਦੀ ਹੈ → ਕਰੰਟ ਕਿਸ ਦਿਸ਼ਾ ਵਿੱਚ ਚੱਲੇਗਾ?

---

> 🎯 **PSEB Exam Trick:** ਸਵਾਲ ਵਿੱਚ "motor", "force on wire", "direction of motion" → **Left Hand Rule**. "Generator", "induced current", "dynamo" → **Right Hand Rule**

> 📌 **PYQ (2022 PSEB, 3 marks):** "State and explain Fleming's Left Hand Rule with diagram."`,
  },

  {
    id: 'demo-11',
    subject: 'SST',
    classNum: 10,
    chapter: 'Ch. 3 — Water Resources',
    tag: '💧 Geography',
    question: 'ਬਹੁ-ਮੰਤਵੀ ਨਦੀ-ਘਾਟੀ ਪ੍ਰੋਜੈਕਟਾਂ ਦੇ ਲਾਭ ਅਤੇ ਨੁਕਸਾਨ — ਭਾਖੜਾ ਨੰਗਲ ਦੀ ਉਦਾਹਰਨ ਨਾਲ',
    answer: `## ਬਹੁ-ਮੰਤਵੀ ਨਦੀ-ਘਾਟੀ ਪ੍ਰੋਜੈਕਟ
### PSEB Class 10 Geography, Ch. 3, Pages 41–47

---

### ਭਾਖੜਾ ਨੰਗਲ — ਭਾਰਤ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ Multi-purpose Project

- **ਦਰਿਆ:** ਸਤਲੁਜ (ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼)
- **ਡੈਮ ਉਚਾਈ:** 226 ਮੀਟਰ (ਏਸ਼ੀਆ ਦੇ ਸਭ ਤੋਂ ਉੱਚੇ ਡੈਮਾਂ ਵਿੱਚੋਂ ਇੱਕ)
- **ਝੀਲ ਦਾ ਨਾਮ:** ਗੋਬਿੰਦ ਸਾਗਰ
- **ਪੰਜਾਬ, ਹਰਿਆਣਾ, ਰਾਜਸਥਾਨ ਨੂੰ ਫ਼ਾਇਦਾ**

---

### ਲਾਭ (Advantages)

| ਖੇਤਰ | ਫ਼ਾਇਦਾ |
|---|---|
| **ਸਿੰਚਾਈ** | 10 ਲੱਖ ਹੈਕਟੇਅਰ ਜ਼ਮੀਨ ਸਿੰਜੀ ਜਾਂਦੀ ਹੈ |
| **ਬਿਜਲੀ** | 1325 MW ਬਿਜਲੀ ਪੈਦਾ |
| **ਹੜ੍ਹ ਕੰਟਰੋਲ** | ਸਤਲੁਜ ਦੇ ਹੜ੍ਹਾਂ ਤੋਂ ਬਚਾਅ |
| **ਸੈਰ-ਸਪਾਟਾ** | ਗੋਬਿੰਦ ਸਾਗਰ ਝੀਲ ਮਛੇਰਿਆਂ ਅਤੇ ਸੈਲਾਨੀਆਂ ਲਈ |
| **ਪੀਣ ਵਾਲਾ ਪਾਣੀ** | ਆਲੇ-ਦੁਆਲੇ ਦੇ ਸ਼ਹਿਰਾਂ ਨੂੰ |

---

### ਨੁਕਸਾਨ (Disadvantages) — PSEB ਵਿੱਚ ਅਕਸਰ ਇਹ ਪੁੱਛਿਆ ਜਾਂਦਾ ਹੈ

1. **ਵਿਸਥਾਪਨ (Displacement):** ਹਜ਼ਾਰਾਂ ਲੋਕਾਂ ਨੂੰ ਘਰ ਛੱਡਣੇ ਪਏ
2. **ਜੰਗਲ ਡੁੱਬੇ:** ਲੱਖਾਂ ਰੁੱਖ ਅਤੇ ਜੀਵ-ਜੰਤੂ ਨਸ਼ਟ
3. **ਮਿੱਟੀ ਦਾ ਕਟਾਓ ਵਧਿਆ:** ਹੇਠਾਂ ਵਾਲੇ ਖੇਤਰਾਂ ਵਿੱਚ
4. **ਜ਼ਮੀਨ ਦੀ ਖਾਰਾਪਣ (Salinity):** ਜ਼ਿਆਦਾ ਸਿੰਚਾਈ ਤੋਂ
5. **ਭੂਚਾਲ ਖ਼ਤਰਾ:** ਵੱਡੇ ਡੈਮ ਭੂਚਾਲ ਸੰਵੇਦਨਸ਼ੀਲ ਖੇਤਰਾਂ ਵਿੱਚ

> 📌 **PSEB ਇਮਤਿਹਾਨ ਸੁਝਾਅ:** ਸਿਰਫ਼ ਲਾਭ ਦੱਸਣ ਨਾਲ ਅੰਕ ਘੱਟ ਮਿਲਦੇ। ਨੁਕਸਾਨ ਲਾਜ਼ਮੀ ਲਿਖੋ।

> 🎯 **PYQ (PSEB 2023, 5 marks):** "What are the advantages and disadvantages of multipurpose river valley projects in India?"`,
  },

  {
    id: 'demo-12',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 3 — Metals and Non-Metals',
    tag: '⚗️ Chemistry',
    question: 'Reactivity Series ਕੀ ਹੈ? ਇਸਦੇ ਆਧਾਰ ਤੇ ਦੱਸੋ ਕਿ ਕਾਂਸੀ ਜ਼ੰਗ ਕਿਉਂ ਨਹੀਂ ਲੱਗਦਾ ਪਰ ਲੋਹੇ ਨੂੰ ਲੱਗਦਾ ਹੈ',
    answer: `## Reactivity Series ਅਤੇ Corrosion
### PSEB Class 10 Chemistry, Ch. 3, Pages 45–52

---

### Reactivity Series (ਕਿਰਿਆਸ਼ੀਲਤਾ ਲੜੀ)

ਧਾਤਾਂ ਨੂੰ ਉਹਨਾਂ ਦੀ ਕਿਰਿਆਸ਼ੀਲਤਾ ਦੇ ਆਧਾਰ ਤੇ ਲੜੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ:

\`\`\`
ਸਭ ਤੋਂ ਵੱਧ ਕਿਰਿਆਸ਼ੀਲ
↑  Potassium (K)
↑  Sodium (Na)
↑  Calcium (Ca)
↑  Magnesium (Mg)
↑  Aluminium (Al)
↑  Zinc (Zn)
↑  Iron (Fe)         ← ਲੋਹਾ
↑  Lead (Pb)
↑  Hydrogen (H)      ← ਵਿਭਾਜਕ ਰੇਖਾ
↓  Copper (Cu)       ← ਕਾਂਸੀ
↓  Silver (Ag)
↓  Gold (Au)         ← ਸਭ ਤੋਂ ਘੱਟ ਕਿਰਿਆਸ਼ੀਲ
\`\`\`

---

### ਲੋਹੇ ਨੂੰ ਜ਼ੰਗ ਕਿਉਂ ਲੱਗਦਾ ਹੈ?

Fe Reactivity Series ਵਿੱਚ **ਉੱਪਰ** ਹੈ → **ਬਹੁਤ ਕਿਰਿਆਸ਼ੀਲ**

$$4Fe + 3O_2 + 6H_2O \\rightarrow 4Fe(OH)_3$$

Fe(OH)₃ → ਇਹੀ ਜ਼ੰਗ (Rust) ਹੈ — Fe₂O₃·xH₂O

---

### ਕਾਂਸੀ ਨੂੰ ਜ਼ੰਗ ਕਿਉਂ ਨਹੀਂ ਲੱਗਦਾ?

Cu ਹਾਈਡ੍ਰੋਜਨ ਤੋਂ ਹੇਠਾਂ ਹੈ → **ਘੱਟ ਕਿਰਿਆਸ਼ੀਲ**

ਕਾਂਸੀ ਹਵਾ-ਪਾਣੀ ਨਾਲ ਬਹੁਤ ਘੱਟ ਕਿਰਿਆ ਕਰਦਾ ਹੈ। ਇਸੇ ਲਈ:
- ਭਾਂਡੇ, ਮੂਰਤੀਆਂ ਕਾਂਸੀ ਦੀਆਂ ਬਣਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ
- ਤਾਂਬੇ ਦੀਆਂ ਤਾਰਾਂ ਜ਼ੰਗ-ਮੁਕਤ ਰਹਿੰਦੀਆਂ ਹਨ

---

### ਜ਼ੰਗ ਤੋਂ ਬਚਾਅ (Corrosion Prevention) — PSEB ਦੇ ਸਵਾਲ

| ਤਰੀਕਾ | ਉਦਾਹਰਨ |
|---|---|
| ਰੰਗ ਲਗਾਉਣਾ | ਪੁਲ਼ਾਂ, ਗ੍ਰਿੱਲਾਂ ਉੱਤੇ |
| Galvanization (ਜ਼ਿੰਕ ਪਰਤ) | ਬਾਲਟੀਆਂ, ਚਾਦਰਾਂ |
| Alloy ਬਣਾਉਣਾ | Stainless Steel (Fe + Cr + Ni) |
| Electroplating | ਗਹਿਣੇ, ਕਾਰ ਦੇ ਹਿੱਸੇ |

> 🎯 **PSEB Board PYQ (2022):** "Why is iron more reactive than copper? Explain with reference to reactivity series." — 3 marks`,
  },

  {
    id: 'demo-13',
    subject: 'Science',
    classNum: 10,
    chapter: 'Ch. 11 — Human Eye & Colourful World',
    tag: '👁️ Optics Deep-Dive',
    question: 'Human eye ਦੀ ਬਣਤਰ ਦੱਸੋ ਅਤੇ diagram ਵਿੱਚ ਸਮਝਾਓ',
    answer: '',
    messages: [
      {
        role: 'user',
        content: 'Human eye ਦੀ ਬਣਤਰ ਦੱਸੋ ਅਤੇ diagram ਵਿੱਚ ਸਮਝਾਓ',
      },
      {
        role: 'assistant',
        content: `## ਮਨੁੱਖੀ ਅੱਖ ਦੀ ਬਣਤਰ (Structure of Human Eye)
### PSEB Class 10 Science — Chapter 11, Page 188

---

### Cross-Section Diagram of Human Eye

\`\`\`
                    ┌──────────────────────────────────┐
                    │         HUMAN EYE                │
         Cornea     │                                  │
           │        │      Vitreous                    │
    ───────┤        │       Humour                     │
    ───────┤        │          ╲                       │
           │        │    Lens   ╲                      │
     Pupil ●        │   ( 🔵 )   ╲──────────── Retina  │
           │        │    /       /     ╲               │
    ───────┤        │   /  Aqueous      ╲──── Fovea    │
    ───────┤        │  /   Humour        ╲             │
           │        │                    ╲──── Optic   │
         Iris       │  ←Ciliary Muscle→       Nerve   │
                    └──────────────────────────────────┘

  Light Path:  Cornea → Pupil → Lens → Vitreous → Retina → Brain
\`\`\`

---

### ਮੁੱਖ ਭਾਗ ਅਤੇ ਕੰਮ

| ਭਾਗ | ਕੰਮ |
|---|---|
| **Cornea** (ਕੌਰਨੀਆ) | ਰੋਸ਼ਨੀ ਅੰਦਰ ਦਾਖਲ ਕਰਦਾ ਹੈ, ਮੁੱਖ refraction ਇੱਥੇ |
| **Iris** (ਆਇਰਿਸ) | ਅੱਖ ਦਾ ਰੰਗਦਾਰ ਹਿੱਸਾ — pupil ਦਾ size ਕੰਟਰੋਲ ਕਰਦਾ |
| **Pupil** (ਪੁਤਲੀ) | ਰੋਸ਼ਨੀ ਦਾ ਦਰਵਾਜ਼ਾ — ਹਨੇਰੇ ਵਿੱਚ ਵੱਡੀ, ਰੌਸ਼ਨੀ ਵਿੱਚ ਛੋਟੀ |
| **Lens** (ਲੈਂਸ) | Convex lens — fine focusing, ciliary muscles ਨਾਲ shape ਬਦਲਦਾ |
| **Ciliary Muscles** | Lens ਦੀ focal length ਬਦਲਦੇ ਹਨ → Accommodation |
| **Retina** (ਰੈਟੀਨਾ) | Image ਬਣਦੀ ਹੈ — Rods (ਹਨੇਰੇ ਲਈ) + Cones (ਰੰਗ ਲਈ) |
| **Fovea** | ਸਭ ਤੋਂ ਸਾਫ਼ vision ਦਾ ਕੇਂਦਰ |
| **Optic Nerve** | ਰੈਟੀਨਾ ਤੋਂ brain ਤੱਕ signals ਭੇਜਦਾ |
| **Vitreous Humour** | Lens ਅਤੇ Retina ਵਿਚਕਾਰ ਗਾੜ੍ਹਾ ਤਰਲ — shape ਕਾਇਮ ਰੱਖਦਾ |

---

### ਚਿੱਤਰ ਵਿੱਚ Image ਕਿਵੇਂ ਬਣਦੀ ਹੈ?

\`\`\`
Object          Cornea+Lens          Retina
  │                  │                  │
  ●  ──────────►  ( convex )  ──────►  ● (inverted image)
  │                  │                  │
  │         Refraction twice            │
  │      (cornea + lens both)           │
  └──────────────────────────────────────┘
  Brain flips the image → ਅਸੀਂ ਸਿੱਧਾ ਦੇਖਦੇ ਹਾਂ
\`\`\`

> **ਮਹੱਤਵਪੂਰਨ:** Image ਰੈਟੀਨਾ ਉੱਤੇ inverted ਅਤੇ real ਬਣਦੀ ਹੈ — brain ਇਸਨੂੰ erect ਕਰ ਦਿੰਦਾ ਹੈ।

> 🎯 **PSEB PYQ (2023, 3 marks):** "Draw a labelled diagram of human eye and describe the function of lens and retina."`,
      },
      {
        role: 'user',
        content: 'Vision ਦੇ defects ਕੀ ਹਨ? Myopia ਅਤੇ Hypermetropia ਵਿੱਚ ਕੀ ਫ਼ਰਕ ਹੈ? Ray diagram ਨਾਲ ਸਮਝਾਓ',
      },
      {
        role: 'assistant',
        content: `## ਨਜ਼ਰ ਦੇ ਨੁਕਸ (Defects of Vision)
### PSEB Class 10, Ch. 11, Page 194

---

### 1. Myopia (ਮਾਇਓਪੀਆ) — ਨੇੜੇ ਦੀ ਨਜ਼ਰ / Short-sightedness

\`\`\`
Normal Eye:
  Object ──────────► Lens ──────────────► Image ON Retina ✅

Myopic Eye (ਨੁਕਸਾਨ):
  Object ──────────► Lens ──────────► Image IN FRONT of Retina ❌
                                      ↑
                              (eyeball ਲੰਮਾ ਹੋ ਗਿਆ)

Correction — Concave Lens (ਅਵਤਲ ਲੈਂਸ):
  Object ──► Concave ──► Lens ────────────► Image ON Retina ✅
             (diverges)     (refocuses)
\`\`\`

**ਕਾਰਨ:** Eyeball ਜ਼ਿਆਦਾ ਲੰਮਾ, ਜਾਂ Lens ਬਹੁਤ ਮੋਟਾ
**ਠੀਕ:** Concave (Diverging) Lens ਨਾਲ

---

### 2. Hypermetropia (ਹਾਈਪਰਮੈਟਰੋਪੀਆ) — ਦੂਰ ਦੀ ਨਜ਼ਰ / Long-sightedness

\`\`\`
Hypermetropic Eye (ਨੁਕਸਾਨ):
  Object ──────────► Lens ────────────────────► Image BEHIND Retina ❌
                                               ↑
                                    (eyeball ਛੋਟਾ ਹੋ ਗਿਆ)

Correction — Convex Lens (ਉੱਤਲ ਲੈਂਸ):
  Object ──► Convex ──► Lens ────────────► Image ON Retina ✅
             (converges)
\`\`\`

**ਕਾਰਨ:** Eyeball ਬਹੁਤ ਛੋਟਾ, ਜਾਂ Lens ਪਤਲਾ
**ਠੀਕ:** Convex (Converging) Lens ਨਾਲ

---

### ਤੁਲਨਾ ਸਾਰਣੀ (Comparison Table)

| ਗੁਣ | Myopia | Hypermetropia |
|---|---|---|
| ਹੋਰ ਨਾਮ | Short-sightedness | Long-sightedness |
| ਕੀ ਦੇਖ ਸਕਦੇ ਹਾਂ | ਨੇੜੇ ਸਾਫ਼ ✅ | ਦੂਰ ਸਾਫ਼ ✅ |
| ਕੀ ਨਹੀਂ ਦੇਖ ਸਕਦੇ | ਦੂਰ ਧੁੰਦਲਾ ❌ | ਨੇੜੇ ਧੁੰਦਲਾ ❌ |
| Image ਕਿੱਥੇ | Retina ਤੋਂ ਅੱਗੇ | Retina ਤੋਂ ਪਿੱਛੇ |
| ਠੀਕ ਕਰਨ ਵਾਲਾ ਲੈਂਸ | **Concave** | **Convex** |
| ਪਾਵਰ | Negative (−) | Positive (+) |

---

### 3. Presbyopia — ਉਮਰ ਨਾਲ ਨਜ਼ਰ ਕਮਜ਼ੋਰ ਹੋਣੀ

- Ciliary muscles ਕਮਜ਼ੋਰ → Accommodation ਘੱਟ
- **Bifocal lens** ਦੀ ਵਰਤੋਂ (ਉੱਪਰ Concave + ਹੇਠਾਂ Convex)

> 🎯 **PSEB Board PYQ (2022, 5 marks):** "What is myopia? State its causes and explain with ray diagram how it can be corrected using a suitable lens."
>
> 🎯 **PYQ (2019, 3 marks):** "Distinguish between myopia and hypermetropia with the help of diagrams."`,
      },
      {
        role: 'user',
        content: 'Power of a lens ਕੀ ਹੁੰਦੀ ਹੈ? Formula ਦੱਸੋ ਅਤੇ numerical ਵੀ solve ਕਰੋ',
      },
      {
        role: 'assistant',
        content: `## ਲੈਂਸ ਦੀ ਸ਼ਕਤੀ (Power of a Lens)
### PSEB Class 10, Ch. 10 — Light (Refraction), Page 176

---

### ਪਰਿਭਾਸ਼ਾ (Definition)

> **Power of a lens** = ਰੋਸ਼ਨੀ ਨੂੰ converge ਜਾਂ diverge ਕਰਨ ਦੀ ਸਮਰੱਥਾ

**Formula:**
\`\`\`
        1
P = ─────────
        f

P = Power (in Dioptre, D)
f = Focal length (in metres, m)
\`\`\`

---

### ਮਹੱਤਵਪੂਰਨ ਨੁਕਤੇ

| ਲੈਂਸ ਦੀ ਕਿਸਮ | f | P |
|---|---|---|
| Convex (ਉੱਤਲ) | + (positive) | + (positive) |
| Concave (ਅਵਤਲ) | − (negative) | − (negative) |

- **1 Dioptre** = focal length 1 metre ਵਾਲੇ ਲੈਂਸ ਦੀ power
- ਜਿੰਨਾ ਵੱਧ power → ਓਨਾ ਛੋਟਾ focal length → ਓਨਾ ਜ਼ਿਆਦਾ ਮੋੜ

---

### ਮਿਲੇ-ਜੁਲੇ ਲੈਂਸ (Combination of Lenses)

\`\`\`
P_total = P₁ + P₂ + P₃ + ...
\`\`\`

---

### Numericals — Solved

**ਸਵਾਲ 1:** ਇੱਕ ਡਾਕਟਰ Myopia ਲਈ −2.5 D power ਦੇ ਐਨਕ ਦੱਸਦਾ ਹੈ। Focal length ਕਿੰਨੀ ਹੋਵੇਗੀ?

\`\`\`
P = −2.5 D
f = 1/P = 1/(−2.5) = −0.4 m = −40 cm

ਉੱਤਰ: f = −40 cm (Concave lens ✅ — Myopia ਲਈ ਸਹੀ)
\`\`\`

---

**ਸਵਾਲ 2:** ਦੋ ਲੈਂਸ — P₁ = +3 D ਅਤੇ P₂ = −1.5 D — ਮਿਲਾਏ ਜਾਣ। ਕੁੱਲ power ਅਤੇ focal length ਦੱਸੋ।

\`\`\`
P_total = P₁ + P₂
        = +3 + (−1.5)
        = +1.5 D

f = 1/P = 1/1.5 = 0.667 m ≈ 66.7 cm

ਉੱਤਰ: P = +1.5 D, f ≈ 66.7 cm (Convex combination ✅)
\`\`\`

---

**ਸਵਾਲ 3 (Board Level — 3 marks):** ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਦੂਰ ਦੀ ਨਜ਼ਰ 4 m ਤੱਕ ਹੈ। ਉਸਨੂੰ ਅਨੰਤ (infinity) ਤੱਕ ਦੇਖਣ ਲਈ ਕਿਹੜਾ ਲੈਂਸ ਚਾਹੀਦਾ ਹੈ?

\`\`\`
Far point = 4 m (ਇਸ ਤੋਂ ਪਰੇ ਨਹੀਂ ਦਿਖਦਾ → Myopia)
ਲੈਂਸ ਚਾਹੀਦਾ: image ਨੂੰ ∞ ਤੋਂ 4 m ਤੇ ਲਿਆਵੇ

f = −4 m (negative → Concave ✅)
P = 1/f = 1/(−4) = −0.25 D

ਉੱਤਰ: −0.25 D power ਦਾ Concave lens ਚਾਹੀਦਾ ਹੈ
\`\`\`

---

> 🎯 **PSEB Board PYQ (2023, 2 marks):** "The power of a lens is +2 D. What is its focal length and what type of lens is it?"
>
> 🎯 **PYQ (2020, 3 marks):** "A person cannot see objects beyond 1.2 m. Find the power of the lens needed to correct this defect."

**ਯਾਦ ਰੱਖੋ:** P ਅਤੇ f ਇੱਕ-ਦੂਜੇ ਦੇ reciprocal ਹਨ। f ਹਮੇਸ਼ਾ metres ਵਿੱਚ ਲਓ — cm ਵਿੱਚ ਨਹੀਂ।`,
      },
      {
        role: 'user',
        content: 'PSEB Board ਵਿੱਚ Human Eye ਤੋਂ ਜ਼ਿਆਦਾ ਕਿਹੜੇ ਸਵਾਲ ਆਉਂਦੇ ਹਨ? 5-mark question ਦਾ model answer ਦਿਖਾਓ',
      },
      {
        role: 'assistant',
        content: `## PSEB Board — Human Eye Most Important Questions
### Chapter 11 | High-Frequency PYQ Analysis

---

### ਸਭ ਤੋਂ ਵੱਧ ਆਉਣ ਵਾਲੇ ਸਵਾਲ

| ਸਵਾਲ ਦੀ ਕਿਸਮ | Marks | ਸਾਲ ਆਇਆ |
|---|---|---|
| Diagram of Human Eye (labelled) | 3–5 | 2019, 2021, 2023 |
| Myopia vs Hypermetropia (table/diagram) | 3–5 | 2018, 2020, 2022 |
| Power of lens + Numerical | 2–3 | ਲਗਭਗ ਹਰ ਸਾਲ |
| Dispersion of Light / Rainbow | 3 | 2019, 2022 |
| Scattering of Light (Tyndall Effect) | 2–3 | 2020, 2023 |
| Accommodation of Eye | 2 | 2021 |

---

### 5-Mark Board Question (Most Likely)

> **"Describe the defects of vision. With the help of ray diagrams, explain how myopia and hypermetropia can be corrected."**
> *(PSEB 2022 style — 5 marks)*

---

### ✅ Model Answer (Full Marks Format)

**ਪਰਿਭਾਸ਼ਾ (1 mark):**
ਜਦੋਂ ਅੱਖ ਕਿਸੇ ਕਾਰਨ ਸਾਫ਼ image ਨਹੀਂ ਬਣਾ ਸਕਦੀ, ਇਸਨੂੰ **defect of vision** ਕਿਹਾ ਜਾਂਦਾ ਹੈ।

---

**Myopia (1.5 marks):**

\`\`\`
  ਸਮੱਸਿਆ: Image — Retina ਤੋਂ ਅੱਗੇ ਬਣਦੀ ਹੈ
  ──────────────────────────────────────
  Object ──► [Lens] ─────► ● ──────────│Retina
                            ↑
                          Image (ਗਲਤ ਜਗ੍ਹਾ)

  ਠੀਕ: Concave Lens ਲਗਾਓ
  Object ──► (Concave) ──► [Lens] ──────●│Retina ✅
\`\`\`
- ਕਾਰਨ: Eyeball ਲੰਮਾ / Lens ਮੋਟਾ
- ਠੀਕ: **Concave lens** (−ve power)

---

**Hypermetropia (1.5 marks):**

\`\`\`
  ਸਮੱਸਿਆ: Image — Retina ਤੋਂ ਪਿੱਛੇ ਬਣਦੀ ਹੈ
  ──────────────────────────────────────
  Object ──► [Lens] ─────────────────│Retina ● (ਗਲਤ)

  ਠੀਕ: Convex Lens ਲਗਾਓ
  Object ──► (Convex) ──► [Lens] ────●│Retina ✅
\`\`\`
- ਕਾਰਨ: Eyeball ਛੋਟਾ / Lens ਪਤਲਾ
- ਠੀਕ: **Convex lens** (+ve power)

---

**Presbyopia (0.5 mark — bonus mention):**
- ਉਮਰ ਨਾਲ Ciliary muscles ਕਮਜ਼ੋਰ → Bifocal lens

---

### ਪਰੀਖਿਆ ਲਈ ਸੁਝਾਅ

1. **Ray diagrams ਹਮੇਸ਼ਾ ਦੋ ਦਿਖਾਓ** — ਇੱਕ without correction, ਇੱਕ with correction
2. **Lens ਦਾ ਨਾਮ ਅਤੇ sign** (+/−) ਜ਼ਰੂਰ ਲਿਖੋ
3. **Table format** ਵਿੱਚ ਤੁਲਨਾ → extra marks
4. Diagram ਵਿੱਚ label ਕਰੋ: Retina, Lens, Image position

> 🎯 **Guaranteed topic:** Human Eye diagram + any ONE defect = **ਹਰ ਸਾਲ 3–5 marks ਯਕੀਨੀ**
>
> 📖 **PSEB Textbook pages to revise:** 188–200 (Chapter 11 complete)`,
      },
    ],
  },
];
