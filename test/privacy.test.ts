import { describe, expect, it } from 'vitest';
import { redactSensitiveData } from '../src/core/privacy';

describe('redactSensitiveData', () => {
  it('detects and redacts personal and financial identifiers', () => {
    const result = redactSensitiveData('Email jane@example.com, call +91 98765 43210, Aadhaar 2345 6789 0123, PAN ABCDE1234F, UPI jane@upi, card 4111 1111 1111 1111.');
    expect(result.findings.map(({ type }) => type)).toEqual(['email', 'phone', 'aadhaar', 'pan', 'upi', 'credit-card']);
    expect(result.redactedText).not.toContain('jane@example.com');
    expect(result.redactedText).toContain('[REDACTED:credit-card]');
  });
  it('only redacts Luhn-valid card numbers and recognizes API tokens', () => {
    const result = redactSensitiveData('bad card 4111 1111 1111 1112 and key sk-test_1234567890abcdef');
    expect(result.findings.map(({ type }) => type)).toEqual(['api-key']);
    expect(result.redactedText).toContain('4111 1111 1111 1112');
    expect(result.redactedText).toContain('[REDACTED:api-key]');
  });
  it('leaves empty and unicode text unchanged', () => {
    expect(redactSensitiveData('').redactedText).toBe('');
    expect(redactSensitiveData('東京 café').findings).toEqual([]);
  });
});
