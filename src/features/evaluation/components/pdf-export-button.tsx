'use client';

import * as React from 'react';
import { Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfExportButtonProps {
  reportTitle?: string;
  className?: string;
}

export function PdfExportButton({
  reportTitle: _reportTitle = 'Candidate_Intelligence_Report',
  className,
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }, 150);
  };

  return (
    <Button
      id="btn-export-candidate-report-pdf"
      type="button"
      onClick={handlePrint}
      disabled={isExporting}
      variant="outline"
      size="sm"
      className={
        className ||
        'space-x-2 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100'
      }
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-400" />
          <span>Report Exported</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4 text-purple-400" />
          <span>Export Candidate PDF Report</span>
        </>
      )}
    </Button>
  );
}
