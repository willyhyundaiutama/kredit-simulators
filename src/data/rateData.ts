
/**
 * Sample interest rates data by tenor
 */
export const interestRates = [
  { tenor: 1, rate: 2.88 },
  { tenor: 2, rate: 2.88 },
  { tenor: 3, rate: 2.88 },
  { tenor: 4, rate: 3.88 },
  { tenor: 5, rate: 4.88 },
  { tenor: 6, rate: 5.88 },
  { tenor: 7, rate: 6.88 }
];

/**
 * Detailed insurance rates data by car price range and tenor
 * Rates are in percentages
 */
export const insuranceRates = {
  kombinasi: [
    { minPrice: 0, maxPrice: 125000000, rates: [3.2580, 3.9100, 4.5600, 5.2100, 5.8600, 6.5100, 7.1800] },
    { minPrice: 125000001, maxPrice: 200000000, rates: [2.4700, 2.9100, 3.3500, 3.7900, 4.2300, 4.6700, 5.1100] },
    { minPrice: 200000001, maxPrice: 400000000, rates: [2.0800, 2.4500, 2.8400, 3.2200, 3.6000, 3.9800, 4.3600] },
    { minPrice: 400000001, maxPrice: 800000000, rates: [1.2000, 1.4500, 1.7000, 1.9500, 2.2000, 2.4500, 2.7000] },
    { minPrice: 800000001, maxPrice: Infinity, rates: [1.1600, 1.4000, 1.6400, 1.8800, 2.1200, 2.0500, 2.2500] }
  ],
  allrisk: [
    { minPrice: 0, maxPrice: 125000000, rates: [3.26, 6.52, 9.78, 13.04, 16.30, 19.56, 22.82] },
    { minPrice: 125000001, maxPrice: 200000000, rates: [2.47, 4.94, 7.41, 9.88, 12.35, 14.82, 17.29] },
    { minPrice: 200000001, maxPrice: 400000000, rates: [2.08, 4.16, 6.24, 8.32, 10.40, 12.48, 14.56] },
    { minPrice: 400000001, maxPrice: 800000000, rates: [1.20, 2.40, 3.60, 4.80, 6.00, 7.20, 8.40] },
    { minPrice: 800000001, maxPrice: Infinity, rates: [1.16, 2.32, 3.48, 4.64, 5.80, 6.96, 8.12] }
  ],
  allriskPerluasan: [
    { minPrice: 0, maxPrice: 125000000, rates: [4.00, 7.40, 10.40, 13.20, 15.80, 18.20, 20.40] },
    { minPrice: 125000001, maxPrice: 200000000, rates: [3.00, 6.00, 9.00, 12.00, 15.00, 18.00, 21.00] },
    { minPrice: 200000001, maxPrice: Infinity, rates: [3.00, 5.70, 8.10, 10.35, 12.45, 14.55, 16.65] }
  ]
};

/**
 * Sample additional fees
 */
export const fees = {
  provisionRate: 5.0, // Provision rate in percentage
  adminFees: [
    { minTenor: 1, maxTenor: 3, fee: 3000000 }, // 1-3 tahun: 3,000,000
    { minTenor: 4, maxTenor: 4, fee: 3250000 }, // 4 tahun: 3,250,000
    { minTenor: 5, maxTenor: 7, fee: 3500000 }  // 5-7 tahun: 3,500,000
  ],
  tpiFee: 500000, // TPI fee in Rupiah
  creditProtectionRate: 0.0 // Credit protection rate in percentage
};

/**
 * Get the proper insurance rate based on car price and insurance type for a specific tenor
 */
export const getInsuranceRateFromTable = (
  carPrice: number,
  insuranceType: keyof typeof insuranceRates,
  tenorYears: number = 1
): number => {
  // Ensure tenor is between 1-7
  const tenorIndex = Math.min(Math.max(tenorYears, 1), 7) - 1;
  
  const rateTable = insuranceRates[insuranceType];
  
  // Find the appropriate price range
  for (const priceRange of rateTable) {
    if (carPrice >= priceRange.minPrice && carPrice <= priceRange.maxPrice) {
      return priceRange.rates[tenorIndex];
    }
  }
  
  // Default to the last price range if no match
  return rateTable[rateTable.length - 1].rates[tenorIndex];
};

/**
 * Get the interest rate based on tenor (in years)
 */
export const getInterestRateFromTable = (tenorYears: number): number => {
  const matchedRate = interestRates.find(item => item.tenor === tenorYears);
  return matchedRate ? matchedRate.rate : 4.88; // Default to 4.88% if no match
};

/**
 * Get the appropriate admin fee based on tenor
 */
export const getAdminFee = (tenorYears: number): number => {
  for (const feeRange of fees.adminFees) {
    if (tenorYears >= feeRange.minTenor && tenorYears <= feeRange.maxTenor) {
      return feeRange.fee;
    }
  }
  return fees.adminFees[fees.adminFees.length - 1].fee; // Default to highest fee if no match
};
