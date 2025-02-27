
import React from "react";
import { formatRupiah } from "@/lib/calculations";

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
  tpiFee: number;
  insuranceType?: string;
}

interface ResultsTableProps {
  results: CalculationResults;
  otrPrice: number;
  dpPercent: number;
  tenor: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, otrPrice, dpPercent, tenor }) => {
  return (
    <div className="w-full">
      <div className="glass-card dark:glass-card-dark p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-5">Hasil Simulasi</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* OTR Final Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium mb-2">OTR Final</h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">OTR Final</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(otrPrice)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">DP Murni</td>
                    <td className="px-4 py-3 text-sm text-right">{dpPercent}%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.dpAmount)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Pokok Hutang</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.loanPrincipal)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Provisi Kredit</td>
                    <td className="px-4 py-3 text-sm text-right">5.00%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.provisionFee)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Pokok Hutang Provisi</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.loanWithProvision)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Bunga</td>
                    <td className="px-4 py-3 text-sm text-right">{results.interestRate.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.interestAmount)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Total Hutang</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">{formatRupiah(results.totalLoanAmount)}</td>
                  </tr>
                  <tr className="table-row-alternate bg-primary/5">
                    <td className="px-4 py-3 text-sm font-medium text-left">Angsuran</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-primary">{formatRupiah(results.monthlyInstallment)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Total DP Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium mb-2">Total DP</h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">DP Murni</td>
                    <td className="px-4 py-3 text-sm text-right">{dpPercent}%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.dpAmount)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Angsuran ke-1</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.monthlyInstallment)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Asuransi Mobil {tenor} Tahun</td>
                    <td className="px-4 py-3 text-sm text-right">{results.insuranceRate?.toFixed(2)}% ({results.insuranceType})</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.insuranceAmount)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">TPI III</td>
                    <td className="px-4 py-3 text-sm text-right">0.00%</td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.tpiFee)}</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Credit Protection (NO)</td>
                    <td className="px-4 py-3 text-sm text-right">0.00%</td>
                    <td className="px-4 py-3 text-sm text-right">-</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Provisi</td>
                    <td className="px-4 py-3 text-sm text-right">0.00%</td>
                    <td className="px-4 py-3 text-sm text-right">-</td>
                  </tr>
                  <tr className="table-row-alternate">
                    <td className="px-4 py-3 text-sm font-medium text-left">Admin</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right">{formatRupiah(results.adminFee)}</td>
                  </tr>
                  <tr className="table-row-alternate bg-primary/5">
                    <td className="px-4 py-3 text-sm font-medium text-left">Total DP</td>
                    <td className="px-4 py-3 text-sm text-right"></td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-primary">{formatRupiah(results.totalDp)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tenor: <span className="font-medium text-gray-700 dark:text-gray-300">{tenor} tahun ({tenor * 12} bulan)</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Suku Bunga: <span className="font-medium text-gray-700 dark:text-gray-300">{results.interestRate.toFixed(2)}% per tahun</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Asuransi: <span className="font-medium text-gray-700 dark:text-gray-300">{results.insuranceType} ({results.insuranceRate?.toFixed(2)}%)</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            * Simulasi ini hanya perkiraan. Nilai sebenarnya dapat berbeda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
