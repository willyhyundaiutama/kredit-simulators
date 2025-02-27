
import React, { useState, useEffect } from "react";
import { Shield, Calendar, Car } from "lucide-react";
import FormInput from "./FormInput";
import { formatRupiah } from "@/lib/calculations";
import { getInsuranceRateFromTable } from "@/data/rateData";

interface InsuranceCalculatorProps {
  defaultOtr?: number;
  defaultTenor?: number;
}

const InsuranceCalculator: React.FC<InsuranceCalculatorProps> = ({
  defaultOtr = 300000000,
  defaultTenor = 4
}) => {
  const [otrPrice, setOtrPrice] = useState<number>(defaultOtr);
  const [tenor, setTenor] = useState<number>(defaultTenor);
  const [insuranceType, setInsuranceType] = useState<'kombinasi' | 'allrisk' | 'allriskPerluasan'>('kombinasi');
  const [insuranceRate, setInsuranceRate] = useState<number>(0);
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);
  
  const handleOtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setOtrPrice(0);
    } else {
      setOtrPrice(parseInt(value, 10));
    }
  };

  const handleTenorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setTenor(1);
    } else {
      setTenor(Math.min(Math.max(value, 1), 7)); // Clamp between 1 and 7 years
    }
  };
  
  const calculateInsurance = () => {
    // Get rate from the updated table based on price, insurance type and tenor
    const rate = getInsuranceRateFromTable(otrPrice, insuranceType, tenor);
    setInsuranceRate(rate);
    setInsuranceAmount(otrPrice * (rate / 100));
  };
  
  // Calculate on initial render and when inputs change
  useEffect(() => {
    calculateInsurance();
  }, [otrPrice, tenor, insuranceType]);
  
  return (
    <div className="glass-card dark:glass-card-dark p-6 rounded-2xl animate-fade-in">
      <div className="flex items-center mb-5">
        <Shield className="h-5 w-5 text-primary mr-2" />
        <h2 className="text-xl font-semibold">Kalkulasi Asuransi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            label="Tenor"
            type="number"
            min={1}
            max={7}
            value={tenor}
            onChange={handleTenorChange}
            suffix="tahun"
            description="Jangka waktu kredit (1-7 tahun)"
          />
          
          <div className="space-y-1.5">
            <label className="input-label block">Jenis Asuransi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInsuranceType('kombinasi')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  insuranceType === 'kombinasi'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Kombinasi
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType('allrisk')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  insuranceType === 'allrisk'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Risk
              </button>
              <button
                type="button"
                onClick={() => setInsuranceType('allriskPerluasan')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  insuranceType === 'allriskPerluasan'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                AR Perluasan
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pilih jenis asuransi kendaraan</p>
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-5">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Rate Asuransi:</span>
              <span className="text-lg font-semibold text-primary">{insuranceRate.toFixed(2)}%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Rate asuransi untuk {insuranceType === 'kombinasi' ? 'Kombinasi' : insuranceType === 'allrisk' ? 'All Risk' : 'All Risk Perluasan'} dengan tenor {tenor} tahun
            </p>
          </div>
          
          <div className="p-5 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Biaya Asuransi Tahunan</span>
              <span className="text-2xl font-bold text-primary">{formatRupiah(insuranceAmount)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                untuk tahun pertama
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              * Biaya asuransi dihitung berdasarkan tabel rate sesuai range harga OTR dan tenor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCalculator;
