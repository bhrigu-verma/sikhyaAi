// Starter previous-year question bank (PSEB Class 10). Expand over time or import
// from the textbook pipeline. Kept small + representative for the MVP.
export interface PYQSeed {
  board: string; classNum: number; subject: string; year: number;
  chapter?: string; question: string; answer?: string; marks: number; paperType?: string;
}

export const PYQ_SEED: PYQSeed[] = [
  { board: 'PSEB', classNum: 10, subject: 'Science', year: 2024, chapter: 'Chemical Reactions and Equations', marks: 3, paperType: 'Annual',
    question: 'Balance the chemical equation: Fe + H₂O → Fe₃O₄ + H₂. State the type of reaction.',
    answer: '3Fe + 4H₂O → Fe₃O₄ + 4H₂. It is a displacement / redox reaction.' },
  { board: 'PSEB', classNum: 10, subject: 'Science', year: 2024, chapter: 'Light — Reflection and Refraction', marks: 5, paperType: 'Annual',
    question: 'Derive the mirror formula for a concave mirror and state the sign convention used.' },
  { board: 'PSEB', classNum: 10, subject: 'Science', year: 2023, chapter: 'Electricity', marks: 2, paperType: 'Annual',
    question: "State Ohm's law. Draw the V-I graph for an ohmic conductor.",
    answer: 'V ∝ I at constant temperature; V = IR. The V-I graph is a straight line through the origin.' },
  { board: 'PSEB', classNum: 10, subject: 'Science', year: 2023, chapter: 'Life Processes', marks: 3, paperType: 'Annual',
    question: 'Differentiate between aerobic and anaerobic respiration with one example each.' },
  { board: 'PSEB', classNum: 10, subject: 'Mathematics', year: 2024, chapter: 'Quadratic Equations', marks: 3, paperType: 'Annual',
    question: 'Solve for x: 2x² − 7x + 3 = 0 using the quadratic formula.',
    answer: 'x = 3 or x = 1/2.' },
  { board: 'PSEB', classNum: 10, subject: 'Mathematics', year: 2024, chapter: 'Arithmetic Progressions', marks: 2, paperType: 'Annual',
    question: 'Find the 10th term of the AP: 2, 7, 12, 17, …',
    answer: 'aₙ = a + (n−1)d = 2 + 9×5 = 47.' },
  { board: 'PSEB', classNum: 10, subject: 'Mathematics', year: 2023, chapter: 'Introduction to Trigonometry', marks: 4, paperType: 'Annual',
    question: 'Prove that (1 + tan²A) / (1 + cot²A) = tan²A.' },
  { board: 'PSEB', classNum: 10, subject: 'Mathematics', year: 2023, chapter: 'Probability', marks: 2, paperType: 'Annual',
    question: 'A die is thrown once. Find the probability of getting a prime number.',
    answer: 'Primes on a die: 2,3,5 → P = 3/6 = 1/2.' },
];
