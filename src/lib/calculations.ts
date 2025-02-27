
/**
 * Formats a number as Indonesian Rupiah
 */
export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formats a number as a percentage
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Calculate the down payment amount based on OTR price and DP percentage
 */
export const calculateDPAmount = (otrPrice: number, dpPercentage: number): number => {
  return otrPrice * (dpPercentage / 100);
};

/**
 * Calculate loan principal (pokok hutang)
 */
export const calculateLoanPrincipal = (otrPrice: number, dpAmount: number): number => {
  return otrPrice - dpAmount;
};

/**
 * Calculate provision fee
 */
export const calculateProvisionFee = (loanPrincipal: number, provisionRate: number): number => {
  return loanPrincipal * (provisionRate / 100);
};

/**
 * Calculate loan principal with provision
 */
export const calculateLoanWithProvision = (loanPrincipal: number, provisionFee: number): number => {
  return loanPrincipal + provisionFee;
};

/**
 * Calculate total interest amount
 */
export const calculateInterestAmount = (
  loanPrincipal: number, 
  interestRate: number, 
  tenorYears: number
): number => {
  return loanPrincipal * (interestRate / 100) * tenorYears;
};

/**
 * Calculate total loan amount including interest
 */
export const calculateTotalLoanAmount = (loanPrincipal: number, interestAmount: number): number => {
  return loanPrincipal + interestAmount;
};

/**
 * Calculate monthly installment
 */
export const calculateMonthlyInstallment = (totalLoanAmount: number, tenorMonths: number): number => {
  return totalLoanAmount / tenorMonths;
};

/**
 * Calculate annual insurance cost
 */
export const calculateInsurance = (
  otrPrice: number, 
  insuranceRate: number
): number => {
  return otrPrice * (insuranceRate / 100);
};

/**
 * Calculate combined DP (down payment + first installment + insurance + admin fee)
 */
export const calculateTotalDP = (
  dpAmount: number,
  firstInstallment: number,
  firstYearInsurance: number,
  adminFee: number,
  tpIFee: number,
  creditProtection: number,
  provisionFee: number
): number => {
  return dpAmount + firstInstallment + firstYearInsurance + adminFee + tpIFee + creditProtection + provisionFee;
};

/**
 * Find the appropriate interest rate based on tenor
 */
export const getInterestRate = (tenorYears: number): number => {
  // Default rates, these should be replaced with actual data from a service
  const rates: Record<number, number> = {
    1: 3.5,
    2: 4.0,
    3: 4.5,
    4: 4.88,
    5: 5.2,
    6: 5.5,
    7: 5.8,
    8: 6.0
  };
  
  return rates[tenorYears] || 4.88; // Default to 4.88% if no match
};

/**
 * Find the appropriate insurance rate based on car price and tenor
 */
export const getInsuranceRate = (
  otrPrice: number, 
  tenorYears: number, 
  insuranceType: 'kombinasi' | 'allrisk' | 'allriskPerluasan'
): number => {
  // These are sample insurance rates
  // In a real app, this would come from API or database
  let rate = 3.6; // Default rate
  
  if (insuranceType === 'kombinasi') {
    // Sample rates for kombinasi
    if (otrPrice < 200000000) rate = 3.2;
    else if (otrPrice < 300000000) rate = 3.4;
    else if (otrPrice < 400000000) rate = 3.6;
    else rate = 3.8;
  } else if (insuranceType === 'allrisk') {
    // Sample rates for allrisk
    if (otrPrice < 200000000) rate = 3.8;
    else if (otrPrice < 300000000) rate = 4.0;
    else if (otrPrice < 400000000) rate = 4.2;
    else rate = 4.4;
  } else if (insuranceType === 'allriskPerluasan') {
    // Sample rates for allrisk perluasan
    if (otrPrice < 200000000) rate = 4.2;
    else if (otrPrice < 300000000) rate = 4.4;
    else if (otrPrice < 400000000) rate = 4.6;
    else rate = 4.8;
  }
  
  // Adjust rate based on tenor
  if (tenorYears > 3) rate += 0.2;
  if (tenorYears > 5) rate += 0.2;
  
  return rate;
};
