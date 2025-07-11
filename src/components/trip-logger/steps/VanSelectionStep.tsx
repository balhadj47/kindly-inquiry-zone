
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Car, Gauge } from 'lucide-react';
import VanSelector from '../VanSelector';

interface Van {
  id: string;
  license_plate: string;
  model: string;
  reference_code?: string;
}

interface VanSelectionStepProps {
  availableVans: Van[];
  totalVans: Van[];
  selectedVanId: string;
  onVanChange: (vanId: string) => void;
  startKm: string;
  onStartKmChange: (value: string) => void;
  lastKm: number | null;
  loadingLastKm: boolean;
}

const VanSelectionStep: React.FC<VanSelectionStepProps> = ({
  availableVans,
  totalVans,
  selectedVanId,
  onVanChange,
  startKm,
  onStartKmChange,
  lastKm,
  loadingLastKm
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <Car className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection du véhicule</h3>
        <p className="text-gray-600">Choisissez le véhicule pour votre mission et renseignez le kilométrage</p>
      </div>

      <div className="space-y-4">
        <VanSelector
          availableVans={availableVans}
          totalVans={totalVans}
          selectedVanId={selectedVanId}
          onVanChange={onVanChange}
        />

        <div className="border-t pt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <Gauge className="w-3 h-3 text-orange-600" />
            </div>
            <Label htmlFor="startKm" className="font-semibold text-gray-900">
              Kilométrage de départ *
            </Label>
          </div>
          
          {loadingLastKm && (
            <div className="flex items-center gap-2 mb-3 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Chargement des données du dernier voyage...</span>
            </div>
          )}
          
          <Input
            id="startKm"
            type="number"
            placeholder={
              selectedVanId 
                ? (lastKm !== null ? `Auto-rempli depuis le dernier voyage: ${lastKm} km` : "Entrez le kilométrage de départ")
                : "Sélectionnez d'abord un véhicule"
            }
            value={startKm}
            onChange={(e) => onStartKmChange(e.target.value)}
            min="0"
            required
            disabled={loadingLastKm}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
          
          {lastKm !== null && selectedVanId && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✅ Dernier voyage terminé à: {lastKm} km
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VanSelectionStep;
