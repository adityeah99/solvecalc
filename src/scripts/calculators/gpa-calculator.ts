import { mountForm, FieldError, fmt } from '../calc-form.ts';

// Standard 4.0 scale grade points.
const POINTS: Record<string, number> = {
  A: 4,
  'A-': 3.7,
  'B+': 3.3,
  B: 3,
  'B-': 2.7,
  'C+': 2.3,
  C: 2,
  'C-': 1.7,
  'D+': 1.3,
  D: 1,
  F: 0,
};

const form = document.getElementById('gpa-form') as HTMLFormElement;
mountForm(form, (r) => {
  const raw = r.text('courses', 'your courses');
  const courseLines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (courseLines.length === 0) throw new FieldError('courses', 'Enter at least one course, e.g. "A 3"', true);

  let totalCredits = 0;
  let totalPoints = 0;
  const steps: string[] = [];
  courseLines.forEach((line, i) => {
    const lineNo = i + 1;
    const parts = line.split(/\s+/);
    if (parts.length !== 2) throw new FieldError('courses', `Line ${lineNo}: write a grade and credit hours, like "A 3"`);
    const grade = parts[0].toUpperCase();
    const credits = Number(parts[1]);
    if (!(grade in POINTS)) {
      throw new FieldError('courses', `Line ${lineNo}: "${parts[0]}" is not a known grade. Use A, A-, B+, B, B-, C+, C, C-, D+, D or F`);
    }
    if (!Number.isFinite(credits) || credits <= 0) {
      throw new FieldError('courses', `Line ${lineNo}: credit hours must be a positive number`);
    }
    const pts = POINTS[grade];
    totalCredits += credits;
    totalPoints += pts * credits;
    steps.push(`Line ${lineNo}: ${parts[0]} (${fmt(credits)} credits) gives ${fmt(pts)} × ${fmt(credits)} = ${fmt(pts * credits)} grade points`);
  });

  const gpa = totalPoints / totalCredits;
  steps.push(`GPA = total grade points ÷ total credits = ${fmt(totalPoints)} ÷ ${fmt(totalCredits)} = ${fmt(Math.round(gpa * 100) / 100)}`);

  return {
    lines: [
      { label: 'GPA', value: fmt(Math.round(gpa * 100) / 100), primary: true },
      { label: 'Total grade points', value: fmt(totalPoints) },
      { label: 'Total credits', value: fmt(totalCredits) },
    ],
    steps,
  };
});
