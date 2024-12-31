import { useState } from 'react';
import { Search, Loader2, AlertCircle, Globe, Code, Database } from 'lucide-react';
import { fetchDOMData, fetchGeneratedData } from '../services/api';
import type { ErrorState } from '../types';
import { Navbar } from '../components/Navbar';
import { Background } from '../components/Background';
import { Card } from '../components/Card';
import { DownloadButton } from '../components/DownloadButton';
import { convertToCSV } from '../utils/csvConvertor';

export function ScrapeData() {
  const [url, setUrl] = useState('');
  const [domData, setDomData] = useState<string | null>(null);
  const [selector, setSelector] = useState('');
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ message: '', type: null });

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ message: '', type: null });
    
    try {
      const data = await fetchDOMData(url);
      setDomData(data.DOM_content || null);
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : 'Failed to fetch DOM data', 
        type: 'url' 
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadCSV = () => {
    if (!selectedData) return;

    const csvContent = convertToCSV(selectedData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'scraped_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSelectorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ message: '', type: null });
  
    if (!domData) {
      setError({ message: 'No DOM data available for extraction', type: 'selector' });
      setLoading(false);
      return;
    }
  
    try {
      const data = await fetchGeneratedData(selector, domData);
      setSelectedData(data.get_data || null);
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : 'Failed to extract data', 
        type: 'selector' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Background />
      <Navbar />
      
      <div className="container mx-auto px-4 max-w-7xl py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Web Scraping Tool</h1>
        </div>

        <Card className="p-4 sm:p-6 mb-6">
          <form onSubmit={handleUrlSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
              <div className="flex-1 space-y-2">
                <label className="block text-base sm:text-lg font-medium text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg sm:rounded-xl bg-[#151A2D] border-[#2A3147] text-white placeholder-gray-400 focus:border-none focus:outline-none focus:ring-0 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
                  placeholder="https://example.com"
                  required
                />
                {error.type === 'url' && (
                  <div className="text-red-400 flex items-center gap-1 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{error.message}</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-indigo-500 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 h-10 sm:h-12 text-sm sm:text-base whitespace-nowrap"
              >
                {loading ? (
                  <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Loading...</>
                ) : (
                  <><Search className="w-3 h-3 sm:w-4 sm:h-4" /> Scrape Website</>
                )}
              </button>
            </div>
          </form>
        </Card>

        {domData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#1F2437]/50 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                DOM Data
              </h2>
              <div className="h-96 overflow-auto rounded-lg bg-[#151A2D] p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-indigo-600 hover:scrollbar-thumb-indigo-500">
                <pre className="text-xs sm:text-sm text-gray-300">{domData}</pre>
              </div>
            </Card>

            <div className="flex flex-col gap-4">
              <Card className="bg-[#1F2437]/50 p-4 sm:p-6">
                <form onSubmit={handleSelectorSubmit}>
                  <div className="space-y-3">
                    <label className="block text-base sm:text-lg font-medium text-white flex items-center gap-2">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                      Data Extraction Prompt
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <input
                        type="text"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                         className="flex-1 rounded-lg sm:rounded-xl bg-[#151A2D] border-[#2A3147] text-white placeholder-gray-400 focus:border-none focus:outline-none focus:ring-0 h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
                        placeholder="Example: Extract all product prices"
                        required
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-indigo-500 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 h-10 sm:h-12 text-sm sm:text-base whitespace-nowrap"
                      >
                        {loading ? (
                          <><Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> Loading...</>
                        ) : (
                          <><Search className="w-3 h-3 sm:w-4 sm:h-4" /> Extract</>
                        )}
                      </button>
                    </div>
                    {error.type === 'selector' && (
                      <div className="text-red-400 flex items-center gap-1 text-xs sm:text-sm">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{error.message}</span>
                      </div>
                    )}
                  </div>
                </form>
              </Card>

              {selectedData && (
          <Card className="bg-[#1F2437]/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                Extracted Data
              </h2>
              <DownloadButton onClick={handleDownloadCSV} />
            </div>
            <div className="h-64 overflow-auto rounded-lg bg-[#151A2D] p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-indigo-600 hover:scrollbar-thumb-indigo-500">
              <pre className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap">{selectedData}</pre>
            </div>
          </Card>
        )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}