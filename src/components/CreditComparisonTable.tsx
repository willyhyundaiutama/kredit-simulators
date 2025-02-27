
import React from "react";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import { useSettings } from "@/context/SettingsContext";

interface CreditComparisonTableProps {
  tenor: number;
  monthlyInstallment: number;
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
  tenor,
  monthlyInstallment
}) => {
  const { provisionRate, additionalAdminFee } = useSettings();
  // Set a default OTR price for comparison
  const otrPrice = 300000000; // 300 million as default
  const dpPercent = 30; // 30% as default
  const insuranceType = 'kombinasi'; // kombinasi as default
  
  // Calculate data for each tenor
  const tenorData: TenorData[] = [];
  
  // Generate data for tenors 1-7 years
  for (let t = 1; t <= 7; t++) {
    // Basic calculations
    const dpAmount = otrPrice * (dpPercent / 100);
    const loanPrincipal = otrPrice - dpAmount;
    const provisionFeeAmount = loanPrincipal * (provisionRate / 100);
    const loanWithProvision = loanPrincipal + provisionFeeAmount;
    
    const interestRate = getInterestRateFromTable(t);
    const interestAmount = loanWithProvision * (interestRate / 100) * t;
    
    const totalLoanAmount = loanWithProvision + interestAmount;
    const tenorMonths = t * 12;
    const monthlyInstall = Math.round(totalLoanAmount / tenorMonths);
    
    const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, t);
    const insuranceAmount = otrPrice * (insuranceRate / 100);
    
    const adminFee = getAdminFee(t);
    const totalAdminFee = adminFee + additionalAdminFee;
    
    // Total DP calculation
    const totalDp = dpAmount + monthlyInstall + insuranceAmount + totalAdminFee + fees.tpiFee;
    
    // Add to data array
    tenorData.push({
      tenor: t,
      totalDp,
      monthlyInstallment: monthlyInstall,
      interestRate,
      insuranceRate,
      adminFee: totalAdminFee
    });
  }

  // Find the active tenor data
  const activeTenorData = tenorData.find(data => data.tenor === tenor) || tenorData[0];
  
  return (
    <div className="my-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Perbandingan Tenor</h3>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Tabel Perbandingan - 50% width pada desktop */}
        <div className="lg:w-1/2 w-full">
          <div className="frosted-glass rounded-xl shadow-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-primary to-primary/90 text-white">
                <tr>
                  <th className="font-medium py-3 text-left text-xs pl-4 w-[25%]">
                    TENOR
                  </th>
                  <th className="font-medium py-3 text-center text-xs w-[37.5%]">
                    TOTAL DP
                  </th>
                  <th className="font-medium py-3 text-right text-xs pr-4 w-[37.5%]">
                    ANGSURAN
                  </th>
                </tr>
              </thead>
              <tbody>
                {tenorData.map((data) => (
                  <tr 
                    key={data.tenor}
                    className={`border-b border-gray-100 dark:border-gray-800 transition-all duration-200 ${
                      data.tenor === tenor ? 'bg-primary/10' : 'hover:bg-primary/5'
                    }`}
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
                      <span className={`font-medium text-sm ${data.tenor === tenor ? 'text-accent' : 'text-gray-700 dark:text-gray-300'}`}>
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
          <div className="space-y-3">
            {/* Tenor Card */}
            <div className="gradient-card card-shine rounded-xl p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium">Tenor Terpilih</div>
                </div>
                <div className="text-lg font-bold">{tenor} tahun</div>
              </div>
            </div>
            
            {/* Monthly Installment Card */}
            <div className="gradient-card-secondary card-shine rounded-xl p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium">Angsuran Bulanan</div>
                </div>
                <div className="text-lg font-bold">{formatRupiah(monthlyInstallment)}</div>
              </div>
            </div>
            
            {/* Interest Rate Card */}
            <div className="gradient-card-success card-shine rounded-xl p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium">Bunga</div>
                </div>
                <div className="text-lg font-bold">
                  {activeTenorData.interestRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 italic">* Perhitungan di atas merupakan estimasi. Silahkan hubungi dealer untuk informasi lebih lanjut.</p>
    </div>
  );
};

export default CreditComparisonTable;
