import { useState, useEffect } from 'react';

const STORAGE_KEY = 'thumbly_license';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface UseProReturn {
  isPro: boolean;
  licenseKey: string;
  isVerifying: boolean;
  error: string | null;
  activate: (key: string) => Promise<void>;
  deactivate: () => void;
}

export function usePro(): UseProReturn {
  const [isPro, setIsPro] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && UUID_REGEX.test(saved)) {
      setLicenseKey(saved);
      setIsPro(true);
    }
  }, []);

  const activate = async (key: string) => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key }),
      });
      const data = await res.json();
      if (data.valid) {
        localStorage.setItem(STORAGE_KEY, key);
        setLicenseKey(key);
        setIsPro(true);
      } else {
        setError(data.error || 'ライセンスキーが無効です。');
      }
    } catch {
      setError('認証サーバーに接続できませんでした。');
    } finally {
      setIsVerifying(false);
    }
  };

  const deactivate = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLicenseKey('');
    setIsPro(false);
  };

  return { isPro, licenseKey, isVerifying, error, activate, deactivate };
}
