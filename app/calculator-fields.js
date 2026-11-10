'use client';
import './calculator-fields.css';

export function CalculatorField({ label, value, onChange, min = 0, max = 1e10, step = 'any' }) {
  return <label className="calc-field"><span>{label}</span><input type="number" inputMode="decimal"
    min={min} max={max} step={step} value={value} onChange={event => onChange(event.target.value)}/></label>;
}
export function CalculatorStat({ label, children }) {
  return <div className="calc-stat"><span>{label}</span><strong>{children}</strong></div>;
}
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
