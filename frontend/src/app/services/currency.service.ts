import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencyCode = signal<string>(this.inferCurrencyFromTimezone());

  constructor() {}

  private inferCurrencyFromTimezone(): string {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const lowerTz = tz.toLowerCase();
      
      if (lowerTz.includes('kolkata') || lowerTz.includes('calcutta') || lowerTz.includes('india')) {
        return 'INR';
      }
      if (lowerTz.includes('london') || lowerTz.includes('belfast') || lowerTz.includes('europe/london')) {
        return 'GBP';
      }
      if (lowerTz.includes('europe/paris') || lowerTz.includes('europe/berlin') || 
          lowerTz.includes('europe/rome') || lowerTz.includes('europe/madrid') ||
          lowerTz.includes('europe/amsterdam') || lowerTz.includes('europe/vienna') ||
          lowerTz.includes('europe/stockholm')) {
        return 'EUR';
      }
      if (lowerTz.includes('australia')) {
        return 'AUD';
      }
      if (lowerTz.includes('canada') || lowerTz.includes('vancouver') || lowerTz.includes('toronto')) {
        return 'CAD';
      }
      if (lowerTz.includes('tokyo')) {
        return 'JPY';
      }
      if (lowerTz.includes('singapore')) {
        return 'SGD';
      }
      if (lowerTz.includes('dubai')) {
        return 'AED';
      }
      
      // Default fallback
      return 'USD';
    } catch (e) {
      return 'USD';
    }
  }
}
