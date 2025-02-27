
import React from "react";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";

interface CreditComparisonTableProps {
  otrPrice: number;
  dpPercent: number;
  insuranceType: 'kombinasi' | 'allrisk' | 'allriskPerluasan';
  provisionRate: number;
  additionalAdminFee: number;
}

interface TenorData {
  tenor: number;
  totalDp: number;
  monthlyInstallment: number;
}

const CreditComparisonTable: React.FC<CreditComparisonTableProps> = ({
  otrPrice,
  dpPercent,
  insuranceType,
  provisionRate,
  additionalAdminFee
}) => {
  // Calculate data for each tenor
  const tenorData: TenorData[] = [];
  
  // Generate data for tenors 1-7 years
  for (let tenor = 1; tenor <= 7; tenor++) {
    // Basic calculations
    const dpAmount = otrPrice * (dpPercent / 100);
    const loanPrincipal = otrPrice - dpAmount;
    const provisionFee = loanPrincipal * (provisionRate / 100);
    const loanWithProvision = loanPrincipal + provisionFee;
    
    const interestRate = getInterestRateFromTable(tenor);
    const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
    
    const totalLoanAmount = loanWithProvision + interestAmount;
    const tenorMonths = tenor * 12;
    const monthlyInstallment = totalLoanAmount / tenorMonths;
    
    const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
    const insuranceAmount = otrPrice * (insuranceRate / 100);
    
    const adminFee = getAdminFee(tenor);
    const totalAdminFee = adminFee + additionalAdminFee;
    
    const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
    
    // Total DP calculation
    const totalDp = dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection;
    
    // Add to data array
    tenorData.push({
      tenor,
      totalDp,
      monthlyInstallment
    });
  }
  
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-3">Perbandingan Tenor</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">TIPE</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">TENOR</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">TOTAL DP</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">ANGSURAN</th>
            </tr>
          </thead>
          <tbody>
            {tenorData.map((data, index) => (
              <tr 
                key={data.tenor} 
                className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}
              >
                {index === 0 && (
                  <td rowSpan={7} className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 whitespace-nowrap align-middle">
                    {formatRupiah(otrPrice)}
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 whitespace-nowrap">
                  {data.tenor * 12}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 whitespace-nowrap">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{formatRupiah(data.totalDp)}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 whitespace-nowrap">
                  <span className="text-green-600 dark:text-green-400 font-medium">{formatRupiah(data.monthlyInstallment)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-2">* Tenor dalam bulan, DP dan angsuran dalam Rupiah</p>
    </div>
  );
};

export default CreditComparisonTable;
