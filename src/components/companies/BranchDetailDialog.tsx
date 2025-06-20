
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, ArrowLeft, MapPin, Users, Clock, Phone, Mail } from "lucide-react";
import { Company, Branch } from "@/hooks/useCompanies";
import { useLanguage } from '@/contexts/LanguageContext';

interface BranchDetailDialogProps {
  branch: Branch | null;
  company: Company | null;
  open: boolean;
  onClose: () => void;
  onBackToCompany: () => void;
}

const BranchDetailDialog: React.FC<BranchDetailDialogProps> = ({ 
  branch, 
  company, 
  open, 
  onClose, 
  onBackToCompany 
}) => {
  const { t } = useLanguage();

  if (!branch || !company) return null;

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToCompany}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-green-100 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {branch.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-600">{t.branchOf}</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 font-medium"
                  onClick={onBackToCompany}
                >
                  {company.name}
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 px-3 py-1">
              {t.activeBranch}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
          {/* Branch Information Card */}
          <Card className="h-fit">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t.branchDetails}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.address}</p>
                    <p className="text-gray-900">
                      {branch.address || <span className="italic text-gray-400">{t.noAddressProvided}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.phone}</p>
                    <p className="text-gray-900">
                      {branch.phone || <span className="italic text-gray-400">{t.noPhoneProvided}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.email}</p>
                    <p className="text-gray-900">
                      {branch.email || <span className="italic text-gray-400">{t.noEmailProvided}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.createdDate}</p>
                    <p className="text-gray-900">
                      {new Date(branch.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.branchId}</p>
                    <p className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {branch.id}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Context Card */}
          <Card className="h-fit">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{t.companyContext}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.companyAddress}</p>
                    <p className="text-gray-900">
                      {company.address || <span className="italic text-gray-400">{t.noAddressProvided}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.totalBranchesLabel}</p>
                    <p className="text-gray-900">{company.branches.length} {t.branches.toLowerCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t.branchAge}</p>
                    <p className="text-gray-900">
                      {Math.floor((Date.now() - new Date(branch.created_at).getTime()) / (1000 * 60 * 60 * 24))} {t.daysOld}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBackToCompany}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backTo} {company.name}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.closeDetails}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchDetailDialog;
