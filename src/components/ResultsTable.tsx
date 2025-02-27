
import React, { useState } from "react";
import { formatRupiah } from "@/lib/calculations";
import { ChevronDown, ChevronUp, Car, Calendar, Shield, CreditCard, Info, PiggyBank } from "lucide-react";

interface CalculationResults {
  dpAmount: number;
  loanPrincipal: number;
  provisionFee: number;
  loanWithProvision: number;
  interestRate: number;
  interestAmount: number;
  totalLoanAmount: number;
  monthlyInstallment: number;
  insuranceAmount: number;
  insuranceRate?: number;
  totalDp: number;
  adminFee: number;
  additionalAdminFee?: number;
  totalAdminFee?: number;
  tpiFee: number;
  insuranceType?: string;
  provisionRate?: number;
}

interface ResultsTableProps {
  results: CalculationResults;
  otrPrice: number;
  dpPercent: number;
  tenor: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, otrPrice, dpPercent, tenor }) => {
  const [showDpDetails, setShowDpDetails] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const hasAdditionalAdminFee = results.additionalAdminFee && results.additionalAdminFee > 0;
  
  const getInsuranceTypeDisplay = () => {
    switch(results.insuranceType) {
      case 'Kombinasi': return 'Kombinasi';
      case 'All Risk': return 'All Risk';
      case 'All Risk Perluasan': return 'AR Perluasan';
      default: return results.insuranceType || 'Kombinasi';
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Hasil Simulasi</h2>
          <button 
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"
          >
            {showFullDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Mobile-optimized summary view */}
        <div className="p-4 space-y-4">
          {/* Main Summary Card */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 className="text-base font-medium text-center text-blue-700 dark:text-blue-300 mb-3">
              Ringkasan Simulasi Kredit
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total DP</p>
                <p className="text-sm sm:text-base font-semibold">Rp {formatRupiah(results.totalDp, false)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Angsuran</p>
                <p className="text-sm sm:text-base font-semibold">Rp {formatRupiah(results.monthlyInstallment, false)}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tenor</p>
                <p className="text-sm sm:text-base font-semibold">{tenor} tahun</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Asuransi</p>
                <p className="text-sm sm:text-base font-semibold">{getInsuranceTypeDisplay()}</p>
              </div>
            </div>
          </div>

          {/* DP Details Button */}
          <button
            onClick={() => setShowDpDetails(!showDpDetails)}
            className="w-full flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-3 rounded-lg transition-colors"
          >
            <span className="font-medium text-sm text-blue-700 dark:text-blue-300">Lihat Rincian DP</span>
            <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform ${showDpDetails ? 'rotate-180' : ''}`} />
          </button>

          {/* DP Breakdown */}
          {showDpDetails && (
            <div className="mt-1 bg-white dark:bg-gray-800/80 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">DP Murni ({dpPercent}%)</span>
                <span>{formatRupiah(results.dpAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Angsuran ke-1</span>
                <span>{formatRupiah(results.monthlyInstallment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Asuransi</span>
                <span>{formatRupiah(results.insuranceAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Admin</span>
                <span>{formatRupiah(results.totalAdminFee || results.adminFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">TPI</span>
                <span>{formatRupiah(results.tpiFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-300">Total DP</span>
                <span className="text-primary">{formatRupiah(results.totalDp)}</span>
              </div>
            </div>
          )}

          {/* Full Details Link */}
          <button 
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="w-full flex items-center justify-center space-x-2 text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors text-sm"
          >
            <Info className="w-4 h-4" />
            <span>
              {showFullDetails ? "Sembunyikan Detail Lengkap" : "Lihat Detail Lengkap"}
            </span>
          </button>
        </div>

        {/* Full Details Section */}
        {showFullDetails && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              {/* OTR Final Details */}
              <div className="space-y-3">
                <h3 className="text-base font-medium mb-2">OTR Final</h3>
                <div className="overflow-hidden rounded-lg border">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {/* Mobile-optimized table rows */}
                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">OTR Final</div>
                      <div className="text-sm font-semibold">{formatRupiah(otrPrice)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">DP Murni ({dpPercent}%)</div>
                      <div className="text-sm font-semibold">{formatRupiah(results.dpAmount)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pokok Hutang</div>
                      <div className="text-sm font-semibold">{formatRupiah(results.loanPrincipal)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Provisi Kredit ({results.provisionRate?.toFixed(2)}%)
                      </div>
                      <div className="text-sm font-semibold">{formatRupiah(results.provisionFee)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pokok Hutang Provisi</div>
                      <div className="text-sm font-semibold">{formatRupiah(results.loanWithProvision)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Bunga ({results.interestRate.toFixed(2)}%)
                      </div>
                      <div className="text-sm font-semibold">{formatRupiah(results.interestAmount)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Hutang</div>
                      <div className="text-sm font-semibold">{formatRupiah(results.totalLoanAmount)}</div>
                    </div>

                    <div className="table-row-alternate bg-primary/5 p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Angsuran per Bulan</div>
                      <div className="text-sm font-semibold text-primary">{formatRupiah(results.monthlyInstallment)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Total DP Details */}
              <div className="space-y-3">
                <h3 className="text-base font-medium mb-2">Total DP</h3>
                <div className="overflow-hidden rounded-lg border">
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        DP Murni ({dpPercent}%)
                      </div>
                      <div className="text-sm font-semibold">{formatRupiah(results.dpAmount)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Angsuran ke-1</div>
                      <div className="text-sm font-semibold">{formatRupiah(results.monthlyInstallment)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Asuransi Mobil {tenor} Tahun ({results.insuranceType}, {results.insuranceRate?.toFixed(2)}%)
                      </div>
                      <div className="text-sm font-semibold">{formatRupiah(results.insuranceAmount)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">TPI III (0.00%)</div>
                      <div className="text-sm font-semibold">{formatRupiah(results.tpiFee)}</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Credit Protection (NO)</div>
                      <div className="text-sm font-semibold">-</div>
                    </div>

                    <div className="table-row-alternate p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Provisi (0.00%)</div>
                      <div className="text-sm font-semibold">-</div>
                    </div>

                    {hasAdditionalAdminFee ? (
                      <>
                        <div className="table-row-alternate p-3 flex flex-col">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admin (Dasar)</div>
                          <div className="text-sm font-semibold">{formatRupiah(results.adminFee)}</div>
                        </div>
                        <div className="table-row-alternate p-3 flex flex-col">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Admin (Tambahan)</div>
                          <div className="text-sm font-semibold">{formatRupiah(results.additionalAdminFee)}</div>
                        </div>
                      </>
                    ) : (
                      <div className="table-row-alternate p-3 flex flex-col">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Biaya Admin</div>
                        <div className="text-sm font-semibold">{formatRupiah(results.adminFee)}</div>
                      </div>
                    )}

                    <div className="table-row-alternate bg-primary/5 p-3 flex flex-col">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total DP</div>
                      <div className="text-sm font-semibold text-primary">{formatRupiah(results.totalDp)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tenor:</span> {tenor} tahun ({tenor * 12} bulan)
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Suku Bunga:</span> {results.interestRate.toFixed(2)}% per tahun
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Provisi:</span> {results.provisionRate?.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Asuransi:</span> {results.insuranceType} ({results.insuranceRate?.toFixed(2)}%)
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Admin:</span> {formatRupiah(results.totalAdminFee || results.adminFee)}
                  {hasAdditionalAdminFee && ` (Dasar: ${formatRupiah(results.adminFee)} + Tambahan: ${formatRupiah(results.additionalAdminFee)})`}
                </p>
                <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-2">
                  * Simulasi ini hanya perkiraan. Nilai sebenarnya dapat berbeda.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
