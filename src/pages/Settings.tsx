
import React from "react";
import Navbar from "@/components/Navbar";
import FormInput from "@/components/FormInput";
import { useSettings } from "@/context/SettingsContext";
import { Sliders, Save } from "lucide-react";

const Settings = () => {
  const { provisionRate, setProvisionRate, additionalAdminFee, setAdditionalAdminFee } = useSettings();

  const handleProvisionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setProvisionRate(0);
    } else {
      setProvisionRate(Math.min(Math.max(value, 0), 10)); // Clamp between 0 and 10%
    }
  };
  
  const handleAdditionalAdminFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setAdditionalAdminFee(0);
    } else {
      setAdditionalAdminFee(parseInt(value, 10));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-up">
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
              Konfigurasi
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Pengaturan Simulasi
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ubah parameter perhitungan kredit sesuai kebutuhan Anda
            </p>
          </div>
          
          <div className="glass-card dark:glass-card-dark p-6 rounded-2xl animate-fade-in">
            <div className="flex items-center mb-5">
              <Sliders className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Parameter Biaya</h2>
            </div>
            
            <div className="space-y-6">
              <FormInput
                label="Provisi"
                type="number"
                min={0}
                max={10}
                value={provisionRate}
                onChange={handleProvisionRateChange}
                suffix="%"
                description="Biaya provisi dari pokok hutang"
              />
              
              <FormInput
                label="Biaya Admin Tambahan"
                type="text"
                prefix="Rp"
                value={additionalAdminFee.toLocaleString('id-ID')}
                onChange={handleAdditionalAdminFeeChange}
                placeholder="0"
                description="Biaya admin tambahan di luar biaya admin default"
              />
              
              <div className="pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Perubahan parameter akan diterapkan secara otomatis pada perhitungan simulasi kredit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 Kredit Simulators. All rights reserved.</p>
            <p className="mt-1">
              Dibuat sebagai alat bantu perhitungan simulasi kredit dan asuransi mobil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
