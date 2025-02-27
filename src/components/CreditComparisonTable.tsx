
import React, { useState } from "react";
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
  interestRate: number;
  insuranceRate: number;
  adminFee: number;
}

const CreditComparisonTable: React.FC<CreditComparisonTableProps> = ({
  otrPrice,
  dpPercent,
  insuranceType,
  provisionRate,
  additionalAdminFee
}) => {
  // State untuk menyimpan tenor yang dipilih
  const [selectedTenor, setSelectedTenor] = useState<number>(1);
  
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
      monthlyInstallment,
      interestRate,
      insuranceRate,
      adminFee: totalAdminFee
    });
  }

  // Transform insurance type for display
  const insuranceTypeDisplay = {
    'kombinasi': 'Kombinasi',
    'allrisk': 'All Risk',
    'allriskPerluasan': 'All Risk Perluasan'
  }[insuranceType];
  
  // Handler saat baris di tabel diklik
  const handleRowClick = (tenor: number) => {
    setSelectedTenor(tenor);
  };
  
  // Temukan data untuk tenor yang dipilih
  const selectedTenorData = tenorData.find(data => data.tenor === selectedTenor) || tenorData[0];
  
  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Perbandingan Tenor</h3>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabel Perbandingan - 50% width pada desktop */}
        <div className="lg:w-1/2 w-full">
          <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800/80">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-primary to-primary/90 text-white">
                <tr>
                  <th className="font-semibold py-3 text-left text-xs pl-4 w-[25%]">
                    TENOR
                  </th>
                  <th className="font-semibold py-3 text-center text-xs w-[37.5%]">
                    TOTAL DP
                  </th>
                  <th className="font-semibold py-3 text-right text-xs pr-4 w-[37.5%]">
                    ANGSURAN
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenorData.map((data) => (
                  <tr 
                    key={data.tenor}
                    className={`border-b border-gray-100 dark:border-gray-700 transition-all duration-200 hover:bg-primary/5 cursor-pointer ${
                      selectedTenor === data.tenor ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleRowClick(data.tenor)}
                  >
                    <td className="py-3.5 pl-4">
                      <div className="font-medium text-sm">
                        {data.tenor} thn
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="text-primary font-medium text-sm">
                        {formatRupiah(data.totalDp)}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <span className="text-accent font-medium text-sm">
                        {formatRupiah(data.monthlyInstallment)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info cards di sebelah kanan - 50% width pada desktop */}
        <div className="lg:w-1/2 w-full">
          <div className="space-y-4">
            {/* Harga OTR Card */}
            <div className="bg-blue-600 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">Harga OTR</div>
              </div>
              <div className="text-lg font-bold">Rp {otrPrice.toLocaleString('id-ID')}</div>
            </div>
            
            {/* Asuransi Card */}
            <div className="bg-purple-600 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">Jenis Asuransi</div>
              </div>
              <div className="text-lg font-bold">{insuranceTypeDisplay}</div>
            </div>
            
            {/* DP Calculated Card */}
            <div className="bg-emerald-500 rounded-xl p-4 flex justify-between items-center text-white shadow-xl">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">DP Calculated</div>
              </div>
              <div className="text-lg font-bold">{dpPercent}%</div>
            </div>
            
            {/* Tenor Terpilih Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex justify-between items-center border border-gray-100 dark:border-gray-700 shadow-md">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Tenor Terpilih</div>
              </div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">{selectedTenor} tahun</div>
            </div>
            
            {/* Angsuran Bulanan Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex justify-between items-center border border-gray-100 dark:border-gray-700 shadow-md">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Angsuran Bulanan</div>
              </div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">Rp {selectedTenorData.monthlyInstallment.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 italic">* Perhitungan di atas merupakan estimasi. Silakan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
