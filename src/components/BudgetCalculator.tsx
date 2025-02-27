
import React, { useState, useEffect } from "react";
import { Calculator, Wallet, CreditCard, Calendar, Shield, Car, DollarSign } from "lucide-react";
import FormInput from "./FormInput";
import { formatRupiah } from "@/lib/calculations";
import { fees, getInterestRateFromTable, getInsuranceRateFromTable, getAdminFee } from "@/data/rateData";
import { useSettings } from "@/context/SettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BudgetCalculatorProps {
  defaultOtr?: number;
  defaultTenor?: number;
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  defaultOtr,
  defaultTenor = 4
}) => {
  const { provisionRate, additionalAdminFee } = useSettings();
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr || 0);
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [insuranceType, setInsuranceType] = useState<'kombinasi' | 'allrisk' | 'allriskPerluasan'>('kombinasi');
  const [budgetType, setBudgetType] = useState<'tdp' | 'installment'>('tdp');
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [calculatedDpPercent, setCalculatedDpPercent] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setOtrPrice(0);
    } else {
      setOtrPrice(parseInt(value, 10));
    }
  };

  const handleTenorChange = (value: string) => {
    setTenor(parseInt(value, 10));
  };

  const handleBudgetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    
    if (value === '') {
      setBudgetAmount('');
      return;
    }
    
    const numericValue = parseInt(value, 10);
    setBudgetAmount(numericValue.toLocaleString('id-ID'));
  };

  const findClosestDpPercentage = (targetAmount: number, forInstallment: boolean): number => {
    let closestDp = 20; // Start from minimum DP
    let smallestDiff = Number.MAX_VALUE;
    
    for (let testDp = 20; testDp <= 90; testDp += 0.00001) { // Increment yang jauh lebih kecil
      const dpAmount = otrPrice * (testDp / 100);
      const loanPrincipal = otrPrice - dpAmount;
      const provisionFee = loanPrincipal * (provisionRate / 100);
      const loanWithProvision = loanPrincipal + provisionFee;
      
      const interestRate = getInterestRateFromTable(tenor);
      const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
      const totalLoanAmount = loanWithProvision + interestAmount;
      const monthlyInstallment = Math.round(totalLoanAmount / (tenor * 12));
      
      const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
      const insuranceAmount = otrPrice * (insuranceRate / 100);
      
      const adminFee = getAdminFee(tenor);
      const totalAdminFee = adminFee + additionalAdminFee;
      
      const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
      
      const totalDp = Math.round(dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection);
      
      const currentAmount = forInstallment ? monthlyInstallment : totalDp;
      const diff = Math.abs(currentAmount - targetAmount);
      
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestDp = testDp;
        
        if (diff < 1) { // Lebih ketat untuk mendapatkan hasil yang lebih presisi
          break;
        }
      }
    }
    
    return Number(closestDp.toFixed(5)); // Mengembalikan dengan 5 angka di belakang koma
  };

  // Fungsi untuk menghitung simulasi ketika tombol Calculate diklik
  const handleCalculate = () => {
    if (!budgetAmount || budgetAmount === "" || otrPrice <= 0) {
      setCalculatedDpPercent(null);
      return;
    }

    setIsCalculating(true);
    const numericBudget = parseInt(budgetAmount.replace(/[^\d]/g, ''), 10);

    if (isNaN(numericBudget) || numericBudget <= 0) {
      setCalculatedDpPercent(null);
      setIsCalculating(false);
      return;
    }

    setTimeout(() => {
      try {
        const dpPercentage = findClosestDpPercentage(
          numericBudget,
          budgetType === 'installment'
        );
        setCalculatedDpPercent(dpPercentage);
      } catch (error) {
        console.error("Calculation error:", error);
        setCalculatedDpPercent(null);
      }
      setIsCalculating(false);
    }, 100);
  };

  const calculateResults = () => {
    if (calculatedDpPercent === null) return null;

    const dpAmount = otrPrice * (calculatedDpPercent / 100);
    const loanPrincipal = otrPrice - dpAmount;
    const provisionFee = loanPrincipal * (provisionRate / 100);
    const loanWithProvision = loanPrincipal + provisionFee;
    
    const interestRate = getInterestRateFromTable(tenor);
    const interestAmount = loanWithProvision * (interestRate / 100) * tenor;
    const totalLoanAmount = loanWithProvision + interestAmount;
    const monthlyInstallment = Math.round(totalLoanAmount / (tenor * 12));
    
    const insuranceRate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
    const insuranceAmount = otrPrice * (insuranceRate / 100);
    
    const adminFee = getAdminFee(tenor);
    const totalAdminFee = adminFee + additionalAdminFee;
    
    const creditProtection = loanPrincipal * (fees.creditProtectionRate / 100);
    
    const totalDp = Math.round(dpAmount + monthlyInstallment + insuranceAmount + totalAdminFee + fees.tpiFee + creditProtection);

    return {
      dpPercentage: calculatedDpPercent,
      dpAmount,
      totalDp,
      monthlyInstallment,
      loanPrincipal,
      totalLoanAmount,
      insuranceAmount
    };
  };

  const results = calculatedDpPercent !== null ? calculateResults() : null;

  const getInsuranceTypeDisplay = () => {
    switch(insuranceType) {
      case 'kombinasi': return 'Kombinasi';
      case 'allrisk': return 'All Risk';
      case 'allriskPerluasan': return 'All Risk Perluasan';
      default: return 'Kombinasi';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full gradient-border flex items-center justify-center mr-3">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Simulasi Budget</h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Harga OTR</label>
          <div className="relative">
            <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="premium-input pl-10"
              value={otrPrice > 0 ? otrPrice.toLocaleString('id-ID') : ""}
              onChange={handleOtrChange}
              placeholder="Masukkan harga OTR"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Harga On The Road kendaraan</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Tenor</label>
          <Select 
            value={tenor.toString()} 
            onValueChange={handleTenorChange}
          >
            <SelectTrigger className="premium-input">
              <SelectValue placeholder="Pilih tenor" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <SelectItem value="1">1 tahun</SelectItem>
              <SelectItem value="2">2 tahun</SelectItem>
              <SelectItem value="3">3 tahun</SelectItem>
              <SelectItem value="4">4 tahun</SelectItem>
              <SelectItem value="5">5 tahun</SelectItem>
              <SelectItem value="6">6 tahun</SelectItem>
              <SelectItem value="7">7 tahun</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400">Jangka waktu kredit (1-7 tahun)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Jenis Asuransi</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setInsuranceType('kombinasi')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                insuranceType === 'kombinasi'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Kombinasi
            </button>
            <button
              type="button"
              onClick={() => setInsuranceType('allrisk')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                insuranceType === 'allrisk'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Risk
            </button>
            <button
              type="button"
              onClick={() => setInsuranceType('allriskPerluasan')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                insuranceType === 'allriskPerluasan'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              AR Perluasan
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pilih jenis asuransi kendaraan</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Jenis Budget</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBudgetType('tdp')}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                budgetType === 'tdp'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Budget Total DP
            </button>
            <button
              type="button"
              onClick={() => setBudgetType('installment')}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                budgetType === 'installment'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Budget Angsuran
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
            {budgetType === 'tdp' ? "Budget Total DP" : "Budget Angsuran"}
          </label>
          <div className="relative">
            <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="premium-input pl-10"
              value={budgetAmount}
              onChange={handleBudgetAmountChange}
              placeholder={budgetType === 'tdp' ? "Masukkan budget DP" : "Masukkan budget angsuran"}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {`Masukkan budget ${budgetType === 'tdp' ? 'Total DP' : 'angsuran'} yang Anda inginkan`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="premium-button w-full py-3 px-4 text-white"
          disabled={!budgetAmount || isCalculating || otrPrice <= 0}
        >
          <Calculator className="h-5 w-5 mr-2" />
          <span>{isCalculating ? "Sedang Menghitung..." : "Hitung Simulasi"}</span>
        </button>

        {isCalculating ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">Menghitung simulasi...</p>
          </div>
        ) : results ? (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-6 luxury-text">
              Ringkasan Simulasi Kredit
            </h3>
            
            {/* Layout 2 kolom: cards di kiri, hasil detail di kanan */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Kolom kiri - Info Cards (50% width) */}
              <div className="w-full md:w-1/2">
                <div className="grid grid-cols-1 gap-3 h-full">
                  {/* Harga OTR Card */}
                  <div className="rounded-xl overflow-hidden gradient-border card-shine">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-3">
                          <Car className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/90 font-medium">Harga OTR</p>
                          <p className="text-base font-bold text-white">Rp {otrPrice.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Angsuran Card */}
                  <div className="rounded-xl overflow-hidden gradient-border card-shine">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-3">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/90 font-medium">Angsuran</p>
                          <p className="text-base font-bold text-white">Rp {results.monthlyInstallment.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tenor Card */}
                  <div className="rounded-xl overflow-hidden gradient-border card-shine">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-3">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/90 font-medium">Tenor</p>
                          <p className="text-base font-bold text-white">{tenor} tahun</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Asuransi Card */}
                  <div className="rounded-xl overflow-hidden gradient-border card-shine">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-3">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/90 font-medium">Asuransi</p>
                          <p className="text-base font-bold text-white">{getInsuranceTypeDisplay()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total DP Card */}
                  <div className="rounded-xl overflow-hidden gradient-border card-shine">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-3">
                          <Wallet className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/90 font-medium">Total DP</p>
                          <p className="text-base font-bold text-white">Rp {results.totalDp.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Kolom kanan - Hasil Detail (50% width) */}
              <div className="w-full md:w-1/2">
                <div className="gradient-border h-full">
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-5 h-full">
                    <h3 className="text-lg font-semibold text-primary mb-4">Hasil Simulasi</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">DP yang diperlukan:</span>
                        <span className="text-sm font-medium">{results.dpPercentage.toFixed(5)}%</span>
                      </div>
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">DP Murni:</span>
                        <span className="text-sm font-medium">{formatRupiah(results.dpAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total DP:</span>
                        <span className="text-sm font-medium">{formatRupiah(results.totalDp)}</span>
                      </div>
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Angsuran per bulan:</span>
                        <span className="text-sm font-medium">{formatRupiah(results.monthlyInstallment)}</span>
                      </div>
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Pokok Hutang:</span>
                        <span className="text-sm font-medium">{formatRupiah(results.loanPrincipal)}</span>
                      </div>
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total Pinjaman:</span>
                        <span className="text-sm font-medium">{formatRupiah(results.totalLoanAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center luxury-info-card">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Biaya Asuransi:</span>
                        <span className="text-sm font-medium">{formatRupiah(results.insuranceAmount)}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4 bg-gray-50 dark:bg-gray-800/40 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                      * Hasil simulasi di atas merupakan perkiraan. Silakan hubungi dealer untuk informasi lebih akurat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BudgetCalculator;
