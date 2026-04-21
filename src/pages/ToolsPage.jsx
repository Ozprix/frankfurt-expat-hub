import React, { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { schemaSoftwareApp, schemaBreadcrumb } from '@/utils/structuredData';
import { Link } from 'react-router-dom';
import {
  ArrowRightLeft,
  Calculator,
  Check,
  ClipboardCheck,
  Copy,
  Download,
  Euro,
  Key,
  QrCode,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Lock,
  UserPlus,
} from '@/lib/icons';
import { useAuth } from '@/context/AuthContext';
import {
  calculateGermanNetSalary,
  convertCurrency,
  currencyCodes,
  fallbackRates,
  formatCurrencyAmount,
  formatEuro,
  germanStates,
} from '@/utils/publicTools';

/* ─── shared field styles ─────────────────────────────────────────────────── */
const fieldClass =
  'w-full rounded-lg border border-[#dbe1d8] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none ring-[#0f766e] focus:ring-2';
const labelClass = 'mb-1 block text-sm font-semibold text-[#0f172a]';
const resultBox = 'mt-5 rounded-lg border border-[#dbe1d8] bg-[#f8faf8] p-5';
const btnPrimary =
  'inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#115e59] active:scale-95';
const btnGhost =
  'inline-flex items-center gap-2 rounded-lg border border-[#dbe1d8] bg-white px-4 py-2.5 text-sm font-bold text-[#0f172a] transition hover:border-[#0f766e] active:scale-95';

/* ─── CHECKLIST LEAD MAGNET ──────────────────────────────────────────────── */
const ChecklistLeadMagnet = () => (
  <div id="checklist" className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[#eff6ff] p-3 text-[#1d4ed8]">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Checklist Tracker</p>
          <h2 className="mt-2 text-xl font-black">Frankfurt First 30 Days Checklist</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748b]">
            Use the dedicated checklist page to review the first-month setup steps. Create a free account to save
            progress across devices, request the checklist by email, and continue from your dashboard.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
        <Link
          to="/frankfurt-first-30-days-checklist"
          className="inline-flex items-center justify-center rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
        >
          Open Checklist Tracker
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-[#dbe1d8] bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-[#f8faf8]"
        >
          Continue In Dashboard
        </Link>
      </div>
    </div>
  </div>
);

/* ─── TAX CALCULATOR ──────────────────────────────────────────────────────── */
const TaxCalculator = () => {
  const [form, setForm] = useState({
    gross: '3000',
    period: 'month',
    taxClass: '1',
    churchTax: 'no',
    state: 'Hessen',
    age: '30',
    children: 'no',
    healthType: 'statutory',
    healthExtra: '1.3',
    pensionOption: 'statutory',
    unemploymentOption: 'statutory',
  });

  const result = useMemo(() => calculateGermanNetSalary(form), [form]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === 'healthType') {
        return { ...prev, healthType: value, healthExtra: value === 'private' ? '450' : '1.3' };
      }
      return { ...prev, [name]: value };
    });
  };

  return (
    <div id="tax" className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-[#ecfdf5] p-3 text-[#0f766e]">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black">German Wage Tax Calculator</h2>
          <p className="mt-0.5 text-sm text-[#64748b]">
            Estimate monthly take-home pay from gross salary, tax class, and insurance setup.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { id: 'gross', label: 'Gross Salary', type: 'number', min: 0, step: 50 },
          { id: 'age', label: 'Age', type: 'number', min: 18, max: 80 },
        ].map(({ id, label, ...rest }) => (
          <div key={id}>
            <label className={labelClass} htmlFor={id}>{label}</label>
            <input id={id} name={id} value={form[id]} onChange={update} className={fieldClass} {...rest} />
          </div>
        ))}

        {[
          {
            id: 'period', label: 'Period',
            options: [['month', 'Monthly'], ['year', 'Annual']],
          },
          {
            id: 'taxClass', label: 'Tax Class',
            options: [
              ['1', 'Class 1 – Single'],
              ['2', 'Class 2 – Single Parent'],
              ['3', 'Class 3 – Married (Higher Earner)'],
              ['4', 'Class 4 – Married (Equal Income)'],
              ['5', 'Class 5 – Married (Lower Earner)'],
              ['6', 'Class 6 – Second Job'],
            ],
          },
          {
            id: 'state', label: 'Federal State',
            options: germanStates.map((s) => [s, s]),
          },
          {
            id: 'churchTax', label: 'Church Tax',
            options: [['no', 'No'], ['yes', 'Yes']],
          },
          {
            id: 'children', label: 'Children',
            options: [['no', 'No'], ['yes', 'Yes']],
          },
          {
            id: 'healthType', label: 'Health Insurance',
            options: [['statutory', 'Statutory (GKV)'], ['private', 'Private (PKV)']],
          },
          {
            id: 'pensionOption', label: 'Pension Insurance',
            options: [['statutory', 'Statutory'], ['exempt', 'Exempt / Private']],
          },
          {
            id: 'unemploymentOption', label: 'Unemployment Insurance',
            options: [['statutory', 'Compulsory'], ['exempt', 'Exempt']],
          },
        ].map(({ id, label, options }) => (
          <div key={id}>
            <label className={labelClass} htmlFor={id}>{label}</label>
            <select id={id} name={id} value={form[id]} onChange={update} className={fieldClass}>
              {options.map(([val, txt]) => <option key={val} value={val}>{txt}</option>)}
            </select>
          </div>
        ))}

        <div>
          <label className={labelClass} htmlFor="healthExtra">
            {form.healthType === 'private' ? 'Monthly Private Premium (€)' : 'Health Add-On Rate (%)'}
          </label>
          <input id="healthExtra" name="healthExtra" type="number" min="0" step="0.1"
            value={form.healthExtra} onChange={update} className={fieldClass} />
        </div>
      </div>

      <div className={resultBox}>
        {result.error ? (
          <p className="text-sm font-semibold text-red-600">{result.error}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#64748b]">Take-Home Pay</p>
              <p className="mt-1.5 text-3xl font-black text-[#0f766e]">{formatEuro(result.monthlyNet)}</p>
              <p className="text-sm text-[#475569]">{formatEuro(result.annualNet)} / year</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#64748b]">Taxes</p>
              <p className="mt-1.5 text-sm text-[#475569]">Income tax: {formatEuro(result.incomeTax)}</p>
              <p className="text-sm text-[#475569]">Solidarity: {formatEuro(result.solidarity)}</p>
              <p className="text-sm text-[#475569]">Church: {formatEuro(result.churchTax)}</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#64748b]">Social Contributions</p>
              <p className="mt-1.5 text-sm text-[#475569]">Health: {formatEuro(result.contributions?.health)}</p>
              <p className="text-sm text-[#475569]">Care: {formatEuro(result.contributions?.care)}</p>
              <p className="text-sm text-[#475569]">Pension: {formatEuro(result.contributions?.pension)}</p>
            </div>
          </div>
        )}
        {result.note && <p className="mt-3 text-xs font-semibold text-[#0f766e]">{result.note}</p>}
      </div>
    </div>
  );
};

/* ─── CURRENCY CONVERTER ─────────────────────────────────────────────────── */
const CurrencyConverter = () => {
  const [form, setForm] = useState({ amount: '1000', fromCurrency: 'EUR', toCurrency: 'USD' });
  const [rates, setRates] = useState(fallbackRates);
  const [ratesStatus, setRatesStatus] = useState('Using recent average rates.');
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR');
        const data = await res.json();
        if (!active) return;
        if (data?.rates) {
          setRates({ ...fallbackRates, ...data.rates, EUR: 1 });
          setRatesUpdatedAt(data.date ? new Date(`${data.date}T12:00:00Z`) : new Date());
          setRatesStatus('Live rates loaded.');
        }
      } catch {
        if (active) setRatesStatus('Live rates unavailable — showing recent averages.');
      }
    })();
    return () => { active = false; };
  }, []);

  const result = useMemo(() => convertCurrency({ ...form, rates }), [form, rates]);
  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div id="currency" className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-[#fff7ed] p-3 text-[#c2410c]">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black">Currency Converter</h2>
          <p className="mt-0.5 text-sm text-[#64748b]">
            Convert EUR and 30+ relocation currencies. Current rates are loaded from an external rates API.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="cc-amount">Amount</label>
          <input id="cc-amount" name="amount" type="number" min="0" step="0.01"
            value={form.amount} onChange={update} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="fromCurrency">From</label>
          <select id="fromCurrency" name="fromCurrency" value={form.fromCurrency} onChange={update} className={fieldClass}>
            {currencyCodes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="toCurrency">To</label>
          <select id="toCurrency" name="toCurrency" value={form.toCurrency} onChange={update} className={fieldClass}>
            {currencyCodes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className={resultBox}>
        {result.error ? (
          <p className="text-sm font-semibold text-red-600">{result.error}</p>
        ) : (
          <>
            <p className="text-xs font-black uppercase tracking-wide text-[#64748b]">Converted Amount</p>
            <p className="mt-1.5 text-3xl font-black text-[#0f766e]">
              {formatCurrencyAmount(result.converted, form.toCurrency)}
            </p>
            <p className="mt-1 text-sm text-[#475569]">
              1 {form.fromCurrency} = {result.rate?.toFixed(4)} {form.toCurrency}
            </p>
          </>
        )}
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#64748b]">
          <Euro className="h-3.5 w-3.5" />
          {ratesStatus}
          {ratesUpdatedAt && ` Updated ${ratesUpdatedAt.toLocaleDateString()}.`}
        </p>
      </div>
    </div>
  );
};

/* ─── QR CODE GENERATOR ──────────────────────────────────────────────────── */
const QrCodeGenerator = () => {
  const [text, setText] = useState('https://frankfurtexpatservices.com');
  const [size, setSize] = useState('200');
  const [color, setColor] = useState('0f172a');
  const [bgColor, setBgColor] = useState('ffffff');
  const [qrSrc, setQrSrc] = useState('');
  const [copied, setCopied] = useState(false);

  const buildUrl = (t, s, fg, bg) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${s}x${s}&data=${encodeURIComponent(t || ' ')}&color=${fg}&bgcolor=${bg}&margin=10`;

  useEffect(() => {
    const id = setTimeout(() => setQrSrc(buildUrl(text, size, color, bgColor)), 400);
    return () => clearTimeout(id);
  }, [text, size, color, bgColor]);

  const handleDownload = async () => {
    try {
      const res = await fetch(qrSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrSrc, '_blank');
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(qrSrc).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="qr" className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-[#f0fdf4] p-3 text-[#16a34a]">
          <QrCode className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black">QR Code Generator</h2>
          <p className="mt-0.5 text-sm text-[#64748b]">
            Instant QR codes for URLs, Wi-Fi credentials, contact info, or any text.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="qr-text">Content</label>
            <textarea
              id="qr-text"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`${fieldClass} resize-none`}
              placeholder="https://example.com"
            />
            <p className="mt-2 flex gap-2 text-xs leading-relaxed text-[#92400e]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              QR previews are generated through an external QR service. Do not enter passwords,
              private keys, private Wi-Fi credentials, or other sensitive content.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass} htmlFor="qr-size">Size</label>
              <select id="qr-size" value={size} onChange={(e) => setSize(e.target.value)} className={fieldClass}>
                {['150', '200', '300', '400', '500'].map((s) => (
                  <option key={s} value={s}>{s} × {s} px</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>QR Colour</label>
              <div className="flex items-center gap-2">
                <input type="color" value={`#${color}`}
                  onChange={(e) => setColor(e.target.value.replace('#', ''))}
                  className="h-10 w-12 cursor-pointer rounded border border-[#dbe1d8]" />
                <span className="text-sm text-[#64748b]">#{color}</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={`#${bgColor}`}
                  onChange={(e) => setBgColor(e.target.value.replace('#', ''))}
                  className="h-10 w-12 cursor-pointer rounded border border-[#dbe1d8]" />
                <span className="text-sm text-[#64748b]">#{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={handleDownload} className={btnPrimary}>
              <Download className="h-4 w-4" /> Download PNG
            </button>
            <button onClick={copyUrl} className={btnGhost}>
              {copied ? <Check className="h-4 w-4 text-[#0f766e]" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </div>

        {qrSrc && (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl border border-[#dbe1d8] bg-white p-3 shadow-sm">
              <img src={qrSrc} alt="QR Code preview" width={parseInt(size)} height={parseInt(size)}
                className="block max-w-[200px]" />
            </div>
            <p className="text-xs text-[#64748b]">Live preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── PASSWORD GENERATOR ─────────────────────────────────────────────────── */
const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ uppercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  const generate = () => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const syms = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    let charset = lower;
    if (opts.uppercase) charset += upper;
    if (opts.numbers) charset += nums;
    if (opts.symbols) charset += syms;

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pw = Array.from(arr, (n) => charset[n % charset.length]).join('');
    setPassword(pw);

    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (opts.uppercase) score++;
    if (opts.numbers) score++;
    if (opts.symbols) score++;
    setStrength(score);
  };

  useEffect(() => { generate(); }, [length, opts]);

  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength] || 'Fair';
  const strengthColor = ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500', 'bg-emerald-600'][strength];

  const copy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleOpt = (key) => setOpts((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div id="password" className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-[#fdf4ff] p-3 text-[#9333ea]">
          <Key className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black">Password Generator</h2>
          <p className="mt-0.5 text-sm text-[#64748b]">
            Cryptographically secure passwords using the Web Crypto API — never sent anywhere.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className={labelClass}>
              Length: <span className="text-[#0f766e]">{length}</span>
            </label>
            <input type="range" min="8" max="64" value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-[#0f766e]" />
            <div className="mt-1 flex justify-between text-xs text-[#94a3b8]">
              <span>8</span><span>32</span><span>64</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { key: 'uppercase', label: 'Uppercase letters (A–Z)' },
              { key: 'numbers', label: 'Numbers (0–9)' },
              { key: 'symbols', label: 'Symbols (!@#$…)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#dbe1d8] px-4 py-2.5 hover:bg-[#f8faf8]">
                <input type="checkbox" checked={opts[key]} onChange={() => toggleOpt(key)}
                  className="h-4 w-4 accent-[#0f766e]" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Generated Password</label>
            <div className="relative">
              <input readOnly value={password}
                className={`${fieldClass} pr-20 font-mono text-base tracking-wider`} />
              <button onClick={copy}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-[#f8faf8] px-3 py-1.5 text-xs font-bold transition hover:bg-[#ecfdf5] hover:text-[#0f766e]">
                {copied ? <Check className="h-3.5 w-3.5 text-[#0f766e]" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#64748b]">Strength</span>
              <span className={strength >= 4 ? 'text-[#0f766e]' : strength >= 2 ? 'text-yellow-600' : 'text-red-500'}>
                {strengthLabel}
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-5 gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i < strength ? strengthColor : 'bg-[#e2e8f0]'}`} />
              ))}
            </div>
          </div>

          <button onClick={generate} className={btnPrimary}>
            <RefreshCw className="h-4 w-4" /> Regenerate
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── TOOL NAV ────────────────────────────────────────────────────────────── */
const tools = [
  { id: 'checklist', icon: ClipboardCheck, label: 'Checklist', color: 'text-[#1d4ed8] bg-[#eff6ff]' },
  { id: 'tax',      icon: Calculator,    label: 'Tax Calc',  color: 'text-[#0f766e] bg-[#ecfdf5]' },
  { id: 'currency', icon: ArrowRightLeft, label: 'Currency', color: 'text-[#c2410c] bg-[#fff7ed]' },
  { id: 'qr',       icon: QrCode,        label: 'QR Code',  color: 'text-[#16a34a] bg-[#f0fdf4]' },
  { id: 'password', icon: Key,           label: 'Password', color: 'text-[#9333ea] bg-[#fdf4ff]' },
];

const ToolSignupGate = () => (
  <div className="bg-[#f3f4ef] px-4 py-16 text-[#0f172a] sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
      <section className="rounded-2xl border border-[#dbe1d8] bg-white p-8 shadow-sm sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#0f766e]">
          <Lock className="h-6 w-6" />
        </div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Free Account Required</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          Create a free account to use the relocation tools.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#475569]">
          The tools stay free, but access now requires signup. This helps us understand real demand,
          improve the toolkit, and build the audience before introducing newsletters or paid placements.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
          >
            <UserPlus className="h-4 w-4" />
            Create Free Account
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg border border-[#dbe1d8] bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-[#f8faf8]"
          >
            Log In
          </Link>
        </div>
      </section>

      <aside className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
        <p className="text-sm font-black text-[#0f172a]">Included free tools</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {tools.map(({ id, icon: Icon, label, color }) => (
            <div key={id} className="rounded-lg border border-[#e2e8f0] bg-[#fafaf7] p-4">
              <span className={`mb-3 inline-flex rounded-md p-2 ${color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm font-bold text-[#0f172a]">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-[#64748b]">
          Newsletter signup will come later as an explicit opt-in. Creating an account does not automatically
          subscribe visitors to marketing emails.
        </p>
      </aside>
    </div>
  </div>
);

/* ─── MAIN PAGE ───────────────────────────────────────────────────────────── */
const ToolsPage = () => {
  const { isAuthenticated, loading } = useAuth();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <>
      <SEOHead
	        title="Free Frankfurt Expat Tools | Frankfurt Expat Services"
	        description="Free account tools for Frankfurt expats: German income tax calculator, live EUR currency converter, QR code generator, secure password generator, and relocation checklist."
	        canonical="/tools"
	      />
        <ToolSignupGate />
      </>
    );
  }

  return (
    <>
      <SEOHead
	        title="Free Frankfurt Expat Tools | Frankfurt Expat Services"
	        description="Free account tools for Frankfurt expats: German income tax calculator, live EUR currency converter, QR code generator, secure password generator, and relocation checklist."
	        canonical="/tools"
      >
        <script type="application/ld+json">{JSON.stringify(schemaSoftwareApp())}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb([{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }]))}</script>
      </SEOHead>

      <div className="bg-[#f3f4ef] text-[#0f172a]">
        {/* ── Hero ── */}
        <section className="px-4 pb-10 pt-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Free Tools</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              5 free tools for your Frankfurt move.
            </h1>
	            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
	              Use free account helpers for checklist tracking, salary planning, currency conversion, QR codes,
	              and secure passwords. Checklist progress is saved to your account; sensitive calculator inputs and
	              generated passwords stay in this browser.
	            </p>
            <div className="mt-5 flex w-fit items-center gap-2 rounded-xl border border-[#dbe1d8] bg-white px-5 py-3 text-sm text-[#475569] shadow-sm">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-[#0f766e]" />
              <span>External services are used only where labelled for live exchange rates and QR previews.</span>
            </div>
          </div>
        </section>

        {/* ── Sticky Tool Nav ── */}
        <div className="sticky top-16 z-30 border-b border-[#e2e8f0] bg-white/90 px-4 py-2 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto pb-1">
            {tools.map(({ id, icon: Icon, label, color }) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#475569] transition hover:bg-[#f8fafc] hover:text-[#0f172a]">
                <span className={`rounded-md p-1 ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tools ── */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <ChecklistLeadMagnet />
            <TaxCalculator />
            <CurrencyConverter />
            <div className="grid gap-8 xl:grid-cols-2">
              <QrCodeGenerator />
              <PasswordGenerator />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ToolsPage;
