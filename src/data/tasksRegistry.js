/**
 * tasksRegistry.js
 * 
 * This file contains the complete registry of all possible tasks in the system.
 * 
 * Structure:
 * - id: Unique string identifier (kebab-case)
 * - version: Integer, increment when task logic changes significantly
 * - title: Human readable title
 * - description: Detailed description
 * - category: 'Registration' | 'Health' | 'Immigration' | 'Finance' | 'Other'
 * - jurisdiction: 'Frankfurt' | 'Germany' | 'EU' (for future filtering)
 * - priority: 'high' | 'medium' | 'low'
 * - estimatedDays: Number of days typically required to complete
 * - officialLink: URL to official government page
 * - dependsOn: Array of task IDs that must be completed first
 * - conditions: Array of rules that determine if this task applies to a user
 * 
 * Condition Operators:
 * - '==': Exact match
 * - '!=': Not equal
 * - 'includes': Value is in the user's array (or user's value includes the target)
 * - 'exists': Field is present in user profile
 * - '>': Greater than
 * - '<': Less than
 * 
 * To add a new city:
 * 1. Add 'city' field to conditions (e.g., { field: 'city', operator: '==', value: 'Berlin' })
 * 2. Add appropriate jurisdiction
 */

export const tasksRegistry = [
  // --- Immigration ---
  {
    id: 'residence-permit',
    version: 1,
    title: 'Book Ausländerbehörde Appointment',
    description: 'Schedule appointment at the Frankfurt Foreigners\' Registration Office (Ausländerbehörde) to apply for your residence permit. You will need your passport, biometric photos, and proof of income/employment.',
    category: 'Immigration',
    jurisdiction: 'Frankfurt',
    priority: 'high',
    estimatedDays: 60,
    officialLink: 'https://frankfurt.de/auslaenderwesen',
    dependsOn: ['anmeldung'],
    conditions: [
      { field: 'visaType', operator: '!=', value: 'EU' },
      { field: 'visaType', operator: 'exists', value: true }
    ]
  },

  // --- Registration ---
  {
    id: 'anmeldung',
    version: 1,
    title: 'Complete Anmeldung (City Registration)',
    description: 'Register your address at a Bürgeramt in Frankfurt. This is mandatory within 14 days of moving in. You need your passport and the Wohnungsgeberbestätigung (landlord confirmation).',
    category: 'Registration',
    jurisdiction: 'Frankfurt',
    priority: 'high',
    estimatedDays: 14,
    officialLink: 'https://frankfurt.de/service-und-rathaus/verwaltung/aemter-und-institutionen/buergeramt-statistik-und-wahlen/buergeraemter',
    dependsOn: [],
    conditions: [
      { field: 'hasAnmeldung', operator: '==', value: false }
    ]
  },
  {
    id: 'get-german-phone',
    version: 1,
    title: 'Get German Phone Number',
    description: 'Purchase a German SIM card (prepaid or contract). A local number is often required for bank accounts, bureaucracy appointments, and deliveries.',
    category: 'Registration',
    jurisdiction: 'Germany',
    priority: 'medium',
    estimatedDays: 1,
    officialLink: '',
    dependsOn: [],
    conditions: []
  },

  // --- Finance ---
  {
    id: 'tax-id',
    version: 1,
    title: 'Receive Tax ID (Steuer-ID)',
    description: 'Your Tax ID is mailed to you automatically about 2-3 weeks after your Anmeldung. Ensure your mailbox is labeled with your name immediately after moving in.',
    category: 'Finance',
    jurisdiction: 'Germany',
    priority: 'medium',
    estimatedDays: 21,
    officialLink: 'https://www.bzst.de/EN/Private_customers/Tax_ID_Number/tax_id_number_node.html',
    dependsOn: ['anmeldung'],
    conditions: [
       { field: 'hasAnmeldung', operator: '==', value: true } // If they already have anmeldung, they might still need this if they lost it, but generally for new movers
    ]
  },
  {
    id: 'bank-account',
    version: 1,
    title: 'Open German Bank Account',
    description: 'Open a Girokonto (current account) for salary and rent payments. Many online banks (N26, Vivid) accept video verification, while traditional banks require a post office visit.',
    category: 'Finance',
    jurisdiction: 'Germany',
    priority: 'high',
    estimatedDays: 5,
    officialLink: '',
    dependsOn: ['anmeldung'], // Most banks require Anmeldung, some online ones don't but it's safer to depend
    conditions: []
  },
  {
    id: 'rundfunkbeitrag',
    version: 1,
    title: 'Register for Broadcasting Fee',
    description: 'Every household in Germany must pay the Rundfunkbeitrag (€18.36/month). Register online to avoid accumulated fees and penalties.',
    category: 'Finance',
    jurisdiction: 'Germany',
    priority: 'low',
    estimatedDays: 30,
    officialLink: 'https://www.rundfunkbeitrag.de/welcome/index_ger.html',
    dependsOn: ['anmeldung'],
    conditions: []
  },
  {
    id: 'tax-class-verification',
    version: 1,
    title: 'Verify Tax Class (Steuerklasse)',
    description: 'Check your payslip to ensure you are in the correct tax class. Married couples should verify if Class 3/5 or 4/4 is better for them.',
    category: 'Finance',
    jurisdiction: 'Germany',
    priority: 'low',
    estimatedDays: 45,
    officialLink: '',
    dependsOn: ['tax-id'],
    conditions: [
      { field: 'visaType', operator: 'exists', value: true } // Applies to basically everyone working
    ]
  },

  // --- Health ---
  {
    id: 'health-insurance',
    version: 1,
    title: 'Register for Health Insurance',
    description: 'Health insurance is mandatory. Employees are typically in the public system (TK, AOK). Freelancers or high earners may choose private insurance.',
    category: 'Health',
    jurisdiction: 'Germany',
    priority: 'high',
    estimatedDays: 7,
    officialLink: '',
    dependsOn: [],
    conditions: [
      { field: 'hasInsurance', operator: '==', value: false }
    ]
  },

  // --- Family ---
  {
    id: 'kindergarten-registration',
    version: 1,
    title: 'Register for Kindernet (Kita)',
    description: 'Register your child in the central Frankfurt Kindernet system. Spots are scarce, so do this as early as possible.',
    category: 'Registration',
    jurisdiction: 'Frankfurt',
    priority: 'high',
    estimatedDays: 180, // Takes a long time
    officialLink: 'https://kindernetfrankfurt.de/',
    dependsOn: [], // Can often be done before anmeldung via email sometimes, but strictly usually requires address. We'll leave it independent for planning.
    conditions: [
      { field: 'householdType', operator: '==', value: 'Family' }
    ]
  },

  // --- Transport ---
  {
    id: 'rmv-ticket',
    version: 1,
    title: 'Get RMV Public Transport Pass',
    description: 'Purchase a weekly, monthly, or annual ticket for Frankfurt public transport (U-Bahn, S-Bahn, Tram, Bus).',
    category: 'Registration',
    jurisdiction: 'Frankfurt',
    priority: 'medium',
    estimatedDays: 1,
    officialLink: 'https://www.rmv.de/',
    dependsOn: [],
    conditions: []
  }
];