export const currencyCodes = [
  'EUR',
  'USD',
  'GBP',
  'CHF',
  'JPY',
  'CAD',
  'AUD',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'HUF',
  'CZK',
  'ILS',
  'CNY',
  'INR',
  'SGD',
  'HKD',
  'TRY',
  'ZAR',
  'MXN',
  'BRL',
  'NZD',
  'AED',
  'KRW',
  'THB',
  'SAR',
  'RON',
  'BGN',
  'ISK',
];

export const fallbackRates = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.85,
  CHF: 0.95,
  JPY: 163.5,
  CAD: 1.47,
  AUD: 1.62,
  SEK: 11.2,
  NOK: 11.4,
  DKK: 7.46,
  PLN: 4.3,
  HUF: 390,
  CZK: 25.2,
  ILS: 3.95,
  CNY: 7.8,
  INR: 90,
  SGD: 1.45,
  HKD: 8.45,
  TRY: 35,
  ZAR: 20.2,
  MXN: 18.5,
  BRL: 5.35,
  NZD: 1.76,
  AED: 3.97,
  KRW: 1450,
  THB: 39,
  SAR: 4.05,
  RON: 4.97,
  BGN: 1.96,
  ISK: 150,
};

export const germanStates = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Saxony',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
];

const taxClassRules = {
  1: { allowance: 0, factor: 1, note: 'Standard allowances for single taxpayers.' },
  2: { allowance: 4260, factor: 1, note: 'Includes the single-parent relief amount.' },
  3: { allowance: 12096, factor: 0.92, note: 'Assumes a Class 3/5 split with doubled basic allowance.' },
  4: { allowance: 0, factor: 1, note: 'Useful for married couples with similar income.' },
  5: { allowance: -4000, factor: 1.18, note: 'Higher withholding designed to pair with a Class 3 partner.' },
  6: { allowance: -12096, factor: 1.28, note: 'Second employment without the basic allowance.' },
};

// BaWü and Bayern: 8%; all other states: 9%
const churchTaxRates = {
  'Baden-Württemberg': 0.08,
  Bayern: 0.08,
};

// 2025 Beitragsbemessungsgrenzen (BBG)
const socialLimits = {
  pension: 90600,
  unemployment: 90600,
  health: 66150,
  care: 66150,
};

// 2025 Kinderfreibetrag (incl. BEA-Freibetrag)
const childAllowances = {
  default: 4656,
  class3: 9312,
};

export const formatEuro = (amount) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);

export const formatCurrencyAmount = (amount, currency) =>
  new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);

// §32a EStG — 2025 zones with 2025 Grundfreibetrag (€12,096) and updated BBG thresholds.
// Progressive coefficients derived for boundary continuity.
const calculateBaseIncomeTax = (income) => {
  if (income <= 12095) return 0;
  if (income <= 17429) {
    const y = (income - 12096) / 10000;
    return (1088.84 * y + 1700.84) * y;
  }
  if (income <= 68430) {
    const z = (income - 17430) / 10000;
    return (181.19 * z + 1700.84) * z + 1216.73;
  }
  if (income <= 277825) return 0.42 * income - 14136.83;
  return 0.45 * income - 22471.58;
};

const calculateIncomeTaxByClass = (income, taxClass, hasChildren) => {
  const rule = taxClassRules[taxClass] || taxClassRules[1];
  const childAllowance = hasChildren ? (taxClass === '3' ? childAllowances.class3 : childAllowances.default) : 0;
  const adjustedIncome = Math.max(0, income - rule.allowance - childAllowance);
  return Math.max(0, calculateBaseIncomeTax(adjustedIncome) * rule.factor);
};

const calculateSocialContributions = ({
  annualGross,
  healthType,
  healthExtra,
  state,
  age,
  hasChildren,
  pensionOption,
  unemploymentOption,
}) => {
  const contributions = { health: 0, care: 0, pension: 0, unemployment: 0 };

  if (pensionOption === 'statutory') {
    contributions.pension = Math.min(annualGross, socialLimits.pension) * 0.093;
  }

  if (unemploymentOption === 'statutory') {
    contributions.unemployment = Math.min(annualGross, socialLimits.unemployment) * 0.013;
  }

  if (healthType === 'statutory') {
    const addonPercent = Number.isFinite(healthExtra) ? healthExtra : 1.3;
    contributions.health = Math.min(annualGross, socialLimits.health) * (0.073 + addonPercent / 200);

    // Saxony: employee bears 2.2% (instead of 1.7%) due to abolished holiday
    // Childless surcharge (Kinderlosenzuschlag): +0.6% for age 23+ nationally
    let careRate = state === 'Saxony' ? 0.022 : 0.017;
    if (age >= 23 && !hasChildren) careRate += 0.006;
    contributions.care = Math.min(annualGross, socialLimits.care) * careRate;
  } else {
    const monthlyPremium = Number.isFinite(healthExtra) ? healthExtra : 450;
    contributions.health = monthlyPremium * 12;
  }

  contributions.total = contributions.health + contributions.care + contributions.pension + contributions.unemployment;
  return contributions;
};

export const calculateGermanNetSalary = (form) => {
  const grossValue = Number(form.gross);
  if (!Number.isFinite(grossValue) || grossValue <= 0) {
    return { error: 'Enter a gross salary greater than zero.' };
  }

  const annualGross = form.period === 'month' ? grossValue * 12 : grossValue;
  const hasChildren = form.children === 'yes';
  const healthExtra = Number(String(form.healthExtra).replace(',', '.'));
  const age = Number.parseInt(form.age, 10) || 30;

  const contributions = calculateSocialContributions({
    annualGross,
    healthType: form.healthType,
    healthExtra,
    state: form.state,
    age,
    hasChildren,
    pensionOption: form.pensionOption,
    unemploymentOption: form.unemploymentOption,
  });

  const taxableIncome = Math.max(0, annualGross - contributions.total);
  const incomeTax = calculateIncomeTaxByClass(taxableIncome, form.taxClass, hasChildren);
  const solidarity = incomeTax > 17542.8 ? incomeTax * 0.055 : incomeTax > 16956 ? (incomeTax - 16956) * 0.055 : 0;
  const churchTax = form.churchTax === 'yes' ? incomeTax * (churchTaxRates[form.state] ?? 0.09) : 0;
  const totalTax = incomeTax + solidarity + churchTax;
  const annualNet = annualGross - contributions.total - totalTax;

  return {
    annualGross,
    taxableIncome,
    incomeTax,
    solidarity,
    churchTax,
    totalTax,
    contributions,
    annualNet,
    monthlyNet: annualNet / 12,
    note: taxClassRules[form.taxClass]?.note || '',
  };
};

export const convertCurrency = ({ amount, fromCurrency, toCurrency, rates }) => {
  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return { error: 'Enter an amount greater than zero.' };
  }

  const fromRate = fromCurrency === 'EUR' ? 1 : rates[fromCurrency];
  const toRate = toCurrency === 'EUR' ? 1 : rates[toCurrency];

  if (!fromRate || !toRate) {
    return { error: 'Selected currency pair is not supported.' };
  }

  const amountInEur = fromCurrency === 'EUR' ? parsedAmount : parsedAmount / fromRate;
  const converted = toCurrency === 'EUR' ? amountInEur : amountInEur * toRate;

  return {
    converted,
    rate: converted / parsedAmount,
  };
};
