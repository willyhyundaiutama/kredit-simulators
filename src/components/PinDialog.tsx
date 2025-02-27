
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  correctPin: string;
  onSuccess: () => void;
}

const PinDialog: React.FC<PinDialogProps> = ({ 
  isOpen, 
  onClose, 
  correctPin,
  onSuccess 
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const { toast } = useToast();
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
    if (error) setError(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin === correctPin) {
      toast({
        title: "PIN diterima",
        description: "Anda berhasil memasukkan halaman pengaturan",
        variant: "default",
      });
      onSuccess();
      onClose();
    } else {
      setError(true);
      toast({
        title: "PIN salah",
        description: "Silakan coba lagi dengan PIN yang benar",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-xl font-semibold">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            Masukkan PIN
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Masukkan PIN"
              value={pin}
              onChange={handlePinChange}
              className={`text-center text-lg tracking-widest ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              maxLength={6}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 text-center">
                PIN tidak valid. Silakan coba lagi.
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Konfirmasi</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;
