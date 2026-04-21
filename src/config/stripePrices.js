export const STRIPE_PRICES = {
  PRO: {
    MONTHLY: {
      id: 'price_1SzGPfDcn87XdtB8BIm44ZIN',
      productId: 'prod_TxAlr1rGeN9f1P',
      amount: 900, // €9.00
      currency: 'eur',
      interval: 'month',
      name: 'Bureaucracy Pro Monthly',
      description: 'Full access to all tasks and guides'
    },
    ANNUAL: {
      id: 'price_1SzGZ7Dcn87XdtB8TYdupE88',
      productId: 'prod_TxAupUESYKTt9l',
      amount: 9504, // €95.04
      currency: 'eur',
      interval: 'year',
      name: 'Bureaucracy Pro Annual',
      description: 'Full access to all tasks and guides (Save 12%)'
    }
  },
  MOVE_IN_PACK: {
    MONTHLY: {
      id: 'price_1SzGQjDcn87XdtB8RDFPztR4',
      productId: 'prod_TxAm6qIZKRoHrQ',
      amount: 1500, // €15.00
      currency: 'eur',
      interval: 'month',
      name: 'Move-In Pack Monthly',
      description: 'Complete relocation package with document templates'
    },
    ANNUAL: {
      id: 'price_1SzGbFDcn87XdtB8NcJ8nE1j',
      productId: 'prod_TxAxPWMa5lWwHw',
      amount: 15840, // €158.40
      currency: 'eur',
      interval: 'year',
      name: 'Move-In Pack Annual',
      description: 'Complete relocation package (Save 12%)'
    }
  }
};