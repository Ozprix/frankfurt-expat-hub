/**
 * SEOHead — drop-in Helmet wrapper for every page.
 *
 * Usage (public page):
 *   <SEOHead
 *     title="Frankfurt Tax Calculator | Frankfurt Expat Services"
 *     description="Calculate your net salary in Germany..."
 *     canonical="/tools"
 *     ogImage="/og-tools.jpg"
 *   />
 *
 * Usage (private/auth page — suppresses indexing):
 *   <SEOHead title="Dashboard | Frankfurt Expat Services" noindex />
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const BASE_URL   = 'https://frankfurtexpatservices.com';
const DEFAULT_OG = `${BASE_URL}/og-image.jpg`;
const SITE_NAME  = 'Frankfurt Expat Services';

const SEOHead = ({
  /** Page <title>. Keep under 60 chars including site suffix if added. */
  title,
  /** Meta description. Keep 120–155 chars for best SERP display. */
  description,
  /**
   * Canonical path (e.g. "/tools") or full URL.
   * Defaults to current pathname when omitted.
   */
  canonical,
  /** Absolute URL to OG image (1200×630 recommended). */
  ogImage = DEFAULT_OG,
  /** OG type — "website" for most pages, "article" for blog posts. */
  ogType = 'website',
  /** Pass true on login, signup, dashboard, admin, etc. */
  noindex = false,
  /** Extra <meta> or <link> tags if needed by specific pages. */
  children,
}) => {
  const { pathname } = useLocation();

  const resolvedCanonical = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${BASE_URL}${canonical}`
    : `${BASE_URL}${pathname}`;

  const resolvedTitle = title || SITE_NAME;

  return (
    <Helmet>
      {/* ── Primary ───────────────────────────────────────────────── */}
      <title>{resolvedTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={resolvedCanonical} />

      {/* ── Robots ────────────────────────────────────────────────── */}
      {noindex
        ? <meta name="robots" content="noindex,nofollow" />
        : <meta name="robots" content="index,follow" />
      }

      {/* ── Open Graph ────────────────────────────────────────────── */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content={ogType} />
      <meta property="og:url"         content={resolvedCanonical} />
      <meta property="og:title"       content={resolvedTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image"       content={ogImage} />

      {/* ── Twitter / X ───────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={resolvedCanonical} />
      <meta name="twitter:title"       content={resolvedTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image"       content={ogImage} />

      {/* ── Caller-supplied extras ────────────────────────────────── */}
      {children}
    </Helmet>
  );
};

export default SEOHead;
