import React, { useState } from 'react';
import Icon from './Icon';

interface WebViewerProps {
  url: string;
  onClose: () => void;
}

const WebViewer: React.FC<WebViewerProps> = ({ url, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Extract hostname for a cleaner title
  const title = React.useMemo(() => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return 'Invalid URL';
    }
  }, [url]);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="flex items-center p-3 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 z-10">
        <button onClick={onClose} className="text-slate-300 hover:text-white me-3">
          <Icon as="ArrowLeft" className="w-6 h-6 transform scale-x-[-1]" />
        </button>
        <div className="flex-1 text-center overflow-hidden">
          <h2 className="font-semibold text-white truncate">{title}</h2>
          <p className="text-xs text-slate-400 truncate">{url}</p>
        </div>
        <div className="w-9"></div> {/* Spacer to balance the back button */}
      </header>

      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-teal-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
              <span className="text-lg">...جاري التحميل</span>
            </div>
          </div>
        )}
        <iframe
          src={url}
          onLoad={() => setIsLoading(false)}
          title="Web Viewer"
          className={`w-full h-full border-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms" // Security sandbox
        ></iframe>
      </div>
    </div>
  );
};

export default WebViewer;
