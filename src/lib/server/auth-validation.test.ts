import { describe, expect, it } from 'vitest';
import {
	genderError,
	hostelError,
	normalizePhone,
	phoneError,
	scholarIdError
} from './auth-validation';

describe('phone numbers', () => {
	it('strips the formatting people actually type', () => {
		expect(normalizePhone('+91 98765 43210')).toBe('9876543210');
		expect(normalizePhone('98765-43210')).toBe('9876543210');
		expect(normalizePhone('09876543210')).toBe('9876543210');
		expect(normalizePhone('9876543210')).toBe('9876543210');
	});

	it('accepts exactly ten digits and nothing else', () => {
		expect(phoneError('9876543210')).toBeNull();
		expect(phoneError('')).toMatch(/10-digit/);
		expect(phoneError('98765432')).toMatch(/exactly 10 digits/);
		expect(phoneError('98765432101')).toMatch(/exactly 10 digits/);
	});

	it('rejects letters that survive normalisation as too short', () => {
		expect(phoneError(normalizePhone('not a phone'))).toMatch(/10-digit/);
	});
});

describe('scholar id', () => {
	it('accepts the usual institute formats', () => {
		expect(scholarIdError('2112050')).toBeNull();
		expect(scholarIdError('CSE/2021/050')).toBeNull();
	});

	it('rejects blanks and out-of-range values', () => {
		expect(scholarIdError('')).toMatch(/Enter your scholar ID/);
		expect(scholarIdError('12')).toMatch(/4-20/);
		expect(scholarIdError('x'.repeat(21))).toMatch(/4-20/);
	});
});

describe('hostel and gender', () => {
	it('requires a hostel within length limits', () => {
		expect(hostelError('Kapili')).toBeNull();
		expect(hostelError('')).toMatch(/Enter your hostel/);
		expect(hostelError('h'.repeat(41))).toMatch(/40 characters/);
	});

	it('only accepts known gender values', () => {
		expect(genderError('male')).toBeNull();
		expect(genderError('prefer_not_to_say')).toBeNull();
		expect(genderError('')).toMatch(/Select your gender/);
		expect(genderError('wizard')).toMatch(/valid gender/);
	});
});
