
import React, { useState, useEffect } from "react";
import { Calculator, DollarSign, Percent, Calendar } from "lucide-react";
import FormInput from "./FormInput";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable } from "@/data/rateData";
import ResultsTable from "./ResultsTable";

interface LoanCalculatorProps {
  defaultOtr?: number;
  defaultDpPercent?: number;
  defaultTenor?: number;
}

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
  totalDp: number;
  adminFee: number;
  tpiFee: number;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  defaultOtr = 300000000,
  defaultDpPercent = 20,
  defaultTenor = 4
}) => {
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr);
  const [dpPercent, setDpPercent] = useState<number>(defaultDpPercent);
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setOtrPrice(0);
    } else {
      setOtrPrice(parseInt(value, 10));
    }
  };

  const handleDpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setDpPercent(0);
    } else {
      setDpPercent(Math.min(Math.max(value, 0), 90)); // Clamp between 0 and 90%
    }
  };

  const handleTenorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setTenor(1);
    } else {
      setTenor(Math.min(Math.max(value, 1), 8)); // Clamp between 1 and 8 years
    }
  };

  const calculateLoan = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        const dpAmount = otrPrice * (dpPercent / 100);
        const loanPrincipal = otrPrice - dpAmount;
        const provisionFee = loanPrincipal * (fees.provisionRate / 100);
        const loanWithProvision = loanPrincipal + provisionFee;
        
        const interestRate = getInterestRateFromTable(tenor);
        const interestAmount = loanPrincipal * (interestRate / 100) * tenor;
        const totalLoanAmount = loanPrincipal + interestAmount;
        
        const tenorMonths = tenor * 12;
        const monthlyInstallment = totalLoanAmount / tenorMonths;
        
        // Using a fixed insurance rate of 3.6% for this example
        const insuranceAmount = otrPrice * (3.6 / 100);
        
        const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
        
        // Total DP includes: DP + First Installment + Insurance + Admin Fee + TPI Fee + Credit Protection
        const totalDp = dpAmount + monthlyInstallment + insuranceAmount + fees.adminFee + fees.tpiFee + creditProtection;
        
        setResults({
          dpAmount,
          loanPrincipal,
          provisionFee,
          loanWithProvision,
          interestRate,
          interestAmount,
          totalLoanAmount,
          monthlyInstallment,
          insuranceAmount,
          totalDp,
          adminFee: fees.adminFee,
          tpiFee: fees.tpiFee
        });
        
        setIsCalculating(false);
      } catch (error) {
        console.error("Calculation error:", error);
        setIsCalculating(false);
      }
    }, 600); // Add a slight delay for better UX
  };

  // Calculate on initial render and when inputs change
  useEffect(() => {
    calculateLoan();
  }, [otrPrice, dpPercent, tenor]);

  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl">
          <div className="flex items-center mb-5">
            <Calculator className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Simulasi Kredit</h2>
          </div>
          
          <div className="space-y-6">
            <FormInput
              label="Harga OTR"
              type="text"
              prefix="Rp"
              value={otrPrice.toLocaleString('id-ID')}
              onChange={handleOtrChange}
              placeholder="0"
              description="Harga On The Road kendaraan"
            />
            
            <FormInput
              label="Uang Muka (%)"
              type="number"
              min={0}
              max={90}
              value={dpPercent}
              onChange={handleDpPercentChange}
              suffix="%"
              description="Minimal 20% dari harga OTR"
            />
            
            <FormInput
              label="Tenor"
              type="number"
              min={1}
              max={8}
              value={tenor}
              onChange={handleTenorChange}
              suffix="tahun"
              description="Jangka waktu kredit (1-8 tahun)"
            />
            
            <div className="pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nilai DP Murni: <span className="font-medium text-gray-700 dark:text-gray-300">{formatRupiah(otrPrice * (dpPercent / 100))}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pokok Hutang: <span className="font-medium text-gray-700 dark:text-gray-300">{formatRupiah(otrPrice - (otrPrice * (dpPercent / 100)))}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass-card dark:glass-card-dark p-6 rounded-2xl">
          <div className="flex items-center mb-5">
            <DollarSign className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Biaya Tambahan</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="input-label">Biaya Provisi</p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {fees.provisionRate}% dari Pokok Hutang
                </span>
                <span className="font-medium">
                  {formatRupiah(results?.provisionFee || 0)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="input-label">Biaya Administrasi</p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tetap
                </span>
                <span className="font-medium">
                  {formatRupiah(fees.adminFee)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="input-label">Asuransi Mobil 5 Tahun</p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  3.6% dari Harga OTR (tahun pertama)
                </span>
                <span className="font-medium">
                  {formatRupiah(results?.insuranceAmount || 0)}
                </span>
              </div>
            </div>
            
            <div>
              <p className="input-label">TPI III</p>
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tetap
                </span>
                <span className="font-medium">
                  {formatRupiah(fees.tpiFee)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {results && (
        <div className="mt-8 results-appear">
          <ResultsTable results={results} otrPrice={otrPrice} dpPercent={dpPercent} tenor={tenor} />
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
