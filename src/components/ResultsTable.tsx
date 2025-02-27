import React, { useState } from "react";
import { formatRupiah } from "@/lib/calculations";
import { ChevronDown, ChevronUp, Car, Calendar, Shield, DollarSign, CreditCard, Info } from "lucide-react";

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

        <div className="p-4 space-y-4">
          {/* Main Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OTR Price */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center mb-1">
                <Car className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Harga OTR</span>
              </div>
              <div className="text-xl font-semibold">{formatRupiah(otrPrice)}</div>
            </div>

            {/* Total DP */}
            <div 
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors"
              onClick={() => setShowDpDetails(!showDpDetails)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Total DP</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDpDetails ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-xl font-semibold">{formatRupiah(results.totalDp)}</div>
              
              {/* DP Breakdown */}
              {showDpDetails && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-fade-in">
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
                </div>
              )}
            </div>

            {/* Monthly Payment */}
            <div className="bg-primary/5 rounded-xl p-4">
              <div className="flex items-center mb-1">
                <CreditCard className="w-4 h-4 text-primary mr-2" />
                <span className="text-sm text-gray-500">Angsuran per Bulan</span>
              </div>
              <div className="text-xl font-semibold text-primary">
                {formatRupiah(results.monthlyInstallment)}
              </div>
            </div>

            {/* Tenor */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Tenor</span>
              </div>
              <div className="text-xl font-semibold">
                {tenor} tahun <span className="text-sm font-normal text-gray-500">({tenor * 12} bulan)</span>
              </div>
            </div>
          </div>

          {/* Insurance Type */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center mb-1">
              <Shield className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Asuransi</span>
            </div>
            <div className="text-xl font-semibold">
              {results.insuranceType} 
              <span className="text-sm font-normal text-gray-500 ml-1">
                ({results.insuranceRate?.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Hasil simulasi ini merupakan estimasi. 
              {!showFullDetails && " Klik tombol di kanan atas untuk melihat detail lengkap."}
            </p>
          </div>
        </div>

        {/* Full Details Section */}
        {showFullDetails && (
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              {/* OTR Final Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium mb-2">OTR Final</h3>
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
                <h3 className="text-lg font-medium mb-2">Total DP</h3>
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
