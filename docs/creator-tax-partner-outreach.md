# Creator-Tax Partner Outreach

Goal: sign **1** paying Steuerberater referral partner before driving traffic to `/creator-taxes`.
The funnel (landing page + Creator Records tool + blog post) captures leads today, but earns nothing until a partner is signed.

Target profile: **English-speaking, creator/influencer-specialist Steuerberater**. Most work **fully digital / nationwide**, so Frankfurt location does not matter — remote-friendly is the norm in this niche, which is ideal.

> ⚠️ Contacts below are firm + domain only (found via web search). **Verify the real contact email / form on each site before sending** — do not guess addresses. Update this table as you confirm them.

## Who to skip (won't do per-referral with a solo)
Self-serve tax SaaS — no per-referral deal, they compete with you for the same searcher:
- SteuerGo, Wundertax, Taxfix

Aim at **owner-run / boutique creator-tax practices** — they want clients and can say yes fast.

## Tier 1 — English-language site, creator specialists (contact first)
| Firm | Why they fit | Site / contact |
|---|---|---|
| **UBS Steuerberatung** | Dedicated influencer/creator practice; partner Sven Sistig ex-Head of Tax at ABOUT YOU. Has an English page. | ubs-tax.de/industries/influencer-content-creator (verify email) |
| **BRUCKMANN Tax Consulting Germany** | English page, digital nationwide, explicitly serves influencers/YouTubers/bloggers with international income. | bruckmann-steuerberatung.de/en (verify email) |

## Tier 2 — creator specialists, German-language site but fully digital
Great fit for the work; confirm they'll handle English-speaking clients (many do informally).
| Firm | Why they fit | Site / contact |
|---|---|---|
| **Rebekka Groß** | 100% digital; influencers, creators, affiliate, YouTubers; barter deals. | rebekka-gross-stb.com (verify) |
| **Jan Hens Steuerberatung** | Influencer focus; VAT, barter deals, collaborations, international income. | janhens.de/influencer-content-creator (verify) |
| **steueragenten.de** | Digital; brand deals, affiliate, PR packages, product placements; has an English freelancer page. | steueragenten.de/en/clients/freelancer (verify) |
| **TaxCare (Steuerberaterin Kathi)** | Influencers, models, content creators; digital/flexible. | taxcare-stb.de (verify) |

## Tier 3 — Frankfurt-local, English, general (fallback / cross-sell)
Already on the relocation outreach list (see [relocation-partner-outreach.md](relocation-partner-outreach.md)). Not creator-specialists, but English + local; approach with the creator angle if Tiers 1–2 stall.
- **Taxmain** (mail@taxmain.de) · **Hofmann Klafsky & Fertig** (+49 69 8720 3390)

Start with **Tier 1** — English site means zero friction and they already market to this exact audience.

## Deal to propose
- **Free to start**, referral fee only on **closed** clients (10–15% of their fee, or flat €50–150/referral).
- Move to per-lead pricing later, once conversion is proven.

## Tracking sheet (5 columns — don't build CRM tooling)
`Firm | Tier | Contact (verified?) | Terms discussed | Status (todo / sent / replied / signed)`

---

## Email template
> Link tip: write the URL once, with the full `https://` prefix, e.g.
> `https://frankfurtexpatservices.com`. A bare `frankfurtexpatservices.com` gets
> auto-linked as `http://` and triggers Google's "Redirect Notice" interstitial when
> clicked from Gmail. Don't repeat the URL in the signature — one clean link is enough.

**Subject:** Sending English-speaking creator clients your way — German taxes

Hi [Name],

I run Frankfurt Expat Services (https://frankfurtexpatservices.com). We have a free tool
where content creators in Germany organize their income, brand deals, gifted PR samples,
and expenses into a clean pack — then need a Steuerberater to actually handle the return.
That's exactly what [Firm] does.

I'd like to refer these clients to you. They arrive **pre-organized**, so it's less
admin on your side. No cost to start — I only ask for a referral fee on clients that
actually close, so there's zero risk.

Open to a quick 15-min call this week? Or I can send the next relevant lead as a trial.

Best,
Michael

## LinkedIn / short message version
Hi [Name] — I run frankfurtexpatservices.com. We give creators in Germany a free tool
to organize income, brand deals and gifted PR samples into a prep pack, then they need
a Steuerberater like [Firm] to file. I'd like to refer these (pre-organized) clients to
you — free to start, referral fee only on closed clients. Open to a quick chat?

## Ready-to-send Tier 1 emails
*(confirm the real address on the site first, then send)*

### → UBS Steuerberatung
**Subject:** Sending English-speaking creator clients your way — German taxes

Hi Sven / UBS team,

I run Frankfurt Expat Services (https://frankfurtexpatservices.com). We have a free tool
where content creators in Germany organize their income, brand deals, gifted PR samples,
and expenses into a clean pack — then they need a Steuerberater to file. Your
influencer/creator practice is exactly the right home for them.

I'd like to refer these clients to you. They arrive pre-organized, so it's less admin on
your side. No cost to start — I only ask for a referral fee on clients that actually
close, so there's zero risk.

Open to a quick 15-min call this week? Or I can send the next lead as a trial.

Best,
Michael

### → BRUCKMANN Tax Consulting Germany
**Subject:** Referring English-speaking creator/influencer clients — German taxes

Hi BRUCKMANN team,

I run Frankfurt Expat Services (https://frankfurtexpatservices.com). English-speaking
creators in Germany use our free tool to organize income, brand deals, gifted PR samples,
and expenses into a prep pack — then they need a Steuerberater to handle the return and
the international pieces, which is your specialty.

I'd like to refer these (pre-organized) clients to you. No cost to start — referral fee
only on clients that close, so zero risk on your side.

Open to a quick 15-min call this week? Or I can send the next lead as a trial.

Best,
Michael

## Once a partner signs — wiring it into the funnel
The `/creator-taxes` lead form posts through the existing `contact-form` edge function with
`source='creator-taxes'`, so leads land in the same inbox/flow as everything else. To
activate a partner: forward each `creator-taxes` lead to them (manual is fine to start —
don't build automation for one partner), and once volume justifies it, either add an
auto-forward rule keyed on `source='creator-taxes'` or list the partner by name on the
page. Keep the disclaimer intact — we prepare and refer, we don't advise.
