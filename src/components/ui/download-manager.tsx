'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadManagerProps {
  downloadUrl: string;
  fileName: string;
  isEnabled: boolean;
  onDisabledClick?: () => void;
  buttonText?: string;
  disabledText?: string;
}

export function DownloadManager({
  downloadUrl,
  fileName,
  isEnabled,
  onDisabledClick,
  buttonText = 'Download',
  disabledText = 'Subscribe to Download'
}: DownloadManagerProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    if (!isEnabled) {
      if (onDisabledClick) {
        onDisabledClick();
      }
      return;
    }

    try {
      setIsDownloading(true);

      // Create a fetch request
      const response = await fetch(downloadUrl);
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      // Create a reader
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to start download');

      // Create a new ReadableStream
      const stream = new ReadableStream({
        start(controller) {
          // Since we've already checked that reader exists above,
          // we can safely use it here without optional chaining
          const safeReader = reader;
          
          function push() {
            safeReader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              loaded += value.length;
              if (total) {
                setDownloadProgress(Math.round((loaded / total) * 100));
              }

              controller.enqueue(value);
              push();
            }).catch(error => {
              console.error('Download error:', error);
              controller.error(error);
            });
          }

          push();
        }
      });

      // Convert stream to blob
      const blob = await new Response(stream).blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download completed successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">WiggleByte Agent</h3>
          <p className="text-gray-600 dark:text-gray-400">
            V1.0.0 • Windows
          </p>
        </div>
        <Button
          onClick={handleDownload}
          disabled={!isEnabled || isDownloading}
          className="flex items-center gap-2 min-w-[160px]"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {downloadProgress}%
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              {isEnabled ? buttonText : disabledText}
            </>
          )}
        </Button>
      </div>

      {!isEnabled && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
          <p className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Subscribe to a plan to download and use the software
          </p>
        </div>
      )}

      {isDownloading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#2496f8] h-2 rounded-full transition-all duration-300"
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
} 