// Internationalization (i18n) support
import React from 'react';


export type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'kn' | 'ml' | 'or' | 'pa' | 'as';

export type Translations = {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    confirm: string;
    retry: string;
    back: string;
    next: string;
    done: string;
    search: string;
    filter: string;
    all: string;
    none: string;
    yes: string;
    no: string;
  };
  app: {
    name: string;
    tagline: string;
    welcome: string;
    logout: string;
    profile: string;
    settings: string;
    notifications: string;
  };
  auth: {
    rationCardId: string;
    mobileNumber: string;
    sendOTP: string;
    verifyOTP: string;
    enterOTP: string;
    resendOTP: string;
    selectFamilyMember: string;
    verifyIdentity: string;
    governmentId: string;
    aadhaarCard: string;
    panCard: string;
    voterId: string;
    drivingLicense: string;
    scanQR: string;
    enterManually: string;
    completeVerification: string;
    verificationSuccess: string;
  };
  nav: {
    home: string;
    stocks: string;
    history: string;
    profile: string;
  };
  home: {
    welcomeBack: string;
    scanQRCode: string;
    monthlyUsage: string;
    recentTransactions: string;
    quickStats: string;
    itemsUsed: string;
    remainingValue: string;
  };
  stocks: {
    availableStocks: string;
    shopStock: string;
    yourQuota: string;
    monthlyQuota: string;
    used: string;
    remaining: string;
    available: string;
    outOfStock: string;
    quotaExhausted: string;
    lowStock: string;
  };
  transactions: {
    transactionHistory: string;
    status: string;
    completed: string;
    pending: string;
    failed: string;
    date: string;
    quantity: string;
    amount: string;
    noTransactions: string;
  };
  profile: {
    personalDetails: string;
    accountSettings: string;
    transactionAlerts: string;
    darkMode: string;
    aboutApp: string;
    version: string;
    rationCard: string;
    familyName: string;
    contactInfo: string;
    address: string;
  };
  scanner: {
    scanQRCode: string;
    pointCamera: string;
    flashOn: string;
    flashOff: string;
    manualEntry: string;
    processing: string;
    transactionInitiated: string;
  };
  offline: {
    youAreOffline: string;
    limitedFunctionality: string;
    cachedData: string;
    syncWhenOnline: string;
    tryAgain: string;
  };
};

const englishTranslations: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    retry: 'Retry',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
  },
  app: {
    name: 'DigiRation',
    tagline: 'Ration Shop App',
    welcome: 'Welcome',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
  },
  auth: {
    rationCardId: 'Ration Card ID',
    mobileNumber: 'Mobile Number',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    enterOTP: 'Enter OTP',
    resendOTP: 'Resend OTP',
    selectFamilyMember: 'Select Family Member',
    verifyIdentity: 'Verify Identity',
    governmentId: 'Government ID',
    aadhaarCard: 'Aadhaar Card',
    panCard: 'PAN Card',
    voterId: 'Voter ID',
    drivingLicense: 'Driving License',
    scanQR: 'Scan QR Code',
    enterManually: 'Enter Manually',
    completeVerification: 'Complete Verification',
    verificationSuccess: 'Verification Successful',
  },
  nav: {
    home: 'Home',
    stocks: 'Stocks',
    history: 'History',
    profile: 'Profile',
  },
  home: {
    welcomeBack: 'Welcome back',
    scanQRCode: 'Scan QR Code',
    monthlyUsage: 'Monthly Usage',
    recentTransactions: 'Recent Transactions',
    quickStats: 'Quick Stats',
    itemsUsed: 'Items Used',
    remainingValue: 'Remaining Value',
  },
  stocks: {
    availableStocks: 'Available Stocks',
    shopStock: 'Shop Stock',
    yourQuota: 'Your Quota',
    monthlyQuota: 'Monthly Quota',
    used: 'Used',
    remaining: 'Remaining',
    available: 'Available',
    outOfStock: 'Out of Stock',
    quotaExhausted: 'Quota Exhausted',
    lowStock: 'Low Stock',
  },
  transactions: {
    transactionHistory: 'Transaction History',
    status: 'Status',
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    date: 'Date',
    quantity: 'Quantity',
    amount: 'Amount',
    noTransactions: 'No transactions found',
  },
  profile: {
    personalDetails: 'Personal Details',
    accountSettings: 'Account Settings',
    transactionAlerts: 'Transaction Alerts',
    darkMode: 'Dark Mode',
    aboutApp: 'About App',
    version: 'Version',
    rationCard: 'Ration Card',
    familyName: 'Family Name',
    contactInfo: 'Contact Info',
    address: 'Address',
  },
  scanner: {
    scanQRCode: 'Scan QR Code',
    pointCamera: 'Point camera at QR code',
    flashOn: 'Flash On',
    flashOff: 'Flash Off',
    manualEntry: 'Manual Entry',
    processing: 'Processing...',
    transactionInitiated: 'Transaction Initiated',
  },
  offline: {
    youAreOffline: 'You are offline',
    limitedFunctionality: 'Limited functionality available',
    cachedData: 'Cached data available',
    syncWhenOnline: 'Will sync when online',
    tryAgain: 'Try Again',
  },
};

const placeholderTranslations: Translations = { ...englishTranslations };



const translations: Record<Language, Translations> = {
  en: englishTranslations,
  hi: {
    // ...existing Hindi translations...
    ...englishTranslations,
  },
  ta: {
    // ...existing Tamil translations...
    ...englishTranslations,
  },
  te: placeholderTranslations,
  bn: placeholderTranslations,
  gu: placeholderTranslations,
  mr: placeholderTranslations,
  kn: placeholderTranslations,
  ml: placeholderTranslations,
  or: placeholderTranslations,
  pa: placeholderTranslations,
  as: placeholderTranslations,
};

class I18nManager {
  private static instance: I18nManager;
  private currentLanguage: Language = 'en';
  private listeners: Array<(language: Language) => void> = [];

  static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  init(): void {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    if (translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('language', language);
      this.notifyListeners();
    }
  }

  getTranslations(): Translations {
    return translations[this.currentLanguage];
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.getTranslations();
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : key;
  }

  addLanguageChangeListener(listener: (language: Language) => void): void {
    this.listeners.push(listener);
  }

  removeLanguageChangeListener(listener: (language: Language) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    ];
  }
}

export const i18n = I18nManager.getInstance();

// React hook for translations
export const useTranslation = () => {
  const [language, setLanguageState] = React.useState(i18n.getCurrentLanguage());
  React.useEffect(() => {
    const handleLanguageChange = (newLanguage: Language) => {
      setLanguageState(newLanguage);
    };
    i18n.addLanguageChangeListener(handleLanguageChange);
    return () => i18n.removeLanguageChangeListener(handleLanguageChange);
  }, []);
  return {
    t: (key: string) => i18n.t(key),
    language,
    setLanguage: (lang: Language) => i18n.setLanguage(lang),
    availableLanguages: i18n.getAvailableLanguages(),
  };
};
