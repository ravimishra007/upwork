import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, QrCode, Share2, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CV_URL = "/StanislavNikovCV2023.pdf";

export default function CvDownload() {
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  
  // URL for direct CV download
  const cvUrl = `${window.location.origin}${CV_URL}`;
  
  // Effect to generate QR image for download
  useEffect(() => {
    if (isQrDialogOpen && !qrCodeUrl) {
      // Small delay to ensure the QR code is rendered
      const timer = setTimeout(() => {
        if (qrRef.current) {
          const svg = qrRef.current.querySelector('svg');
          if (svg) {
            // Convert the SVG to a data URL
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            setQrCodeUrl(url);
          }
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isQrDialogOpen, qrCodeUrl]);
  
  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);
  
  const handleDownload = () => {
    // Direct download from server
    window.open(CV_URL, "_blank");
  };
  
  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'StanislavNikovCV_QRCode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "You can now share this QR code with others",
      duration: 3000
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(cvUrl).then(() => {
      toast({
        title: "Link Copied",
        description: "CV download link copied to clipboard",
        duration: 2000
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Stanislav Nikov's CV",
          text: "Check out Stanislav Nikov's CV",
          url: cvUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copy link if Web Share API is not available
      handleCopyLink();
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">My Resume/CV</h2>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CV
          </Button>
          
          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scan or Share QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-4">
                <div ref={qrRef}>
                  <QRCodeSVG
                    value={cvUrl}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                <p className="mt-4 text-sm text-center text-gray-500">
                  Scan this QR code with your phone to download the CV
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <Button onClick={handleDownloadQR} variant="outline" className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Download QR
                  </Button>
                  <Button onClick={handleCopyLink} variant="outline" className="flex items-center justify-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
                <div className="mt-3 w-full">
                  <Button onClick={handleShare} className="w-full flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share CV Link
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}