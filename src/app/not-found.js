'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  
  // Enhanced language detection to match the site's navbar language selector
  useEffect(() => {
    // Initial detection
    detectSiteLanguage();
    
    // Run detection again after DOM is fully loaded
    window.addEventListener('load', detectSiteLanguage);
    
    // Set up an interval to continuously check for language changes
    const intervalId = setInterval(detectSiteLanguage, 1000);
    
    return () => {
      window.removeEventListener('load', detectSiteLanguage);
      clearInterval(intervalId);
    };
  }, []);
  
  const detectSiteLanguage = () => {
    try {
      // Clear priority order for language detection:
      
      // Priority 1: Check selected language in navbar/dropdown first (most reliable)
      const languageSelector = document.querySelector('.language-dropdown') || 
                              document.querySelector('[data-language-selector]') ||
                              document.querySelector('button[aria-haspopup="true"]');
                                   
      if (languageSelector) {
        const selectorText = languageSelector.innerText || '';
        
        // Check for specific exact matches first
        if (selectorText === 'English' || selectorText === 'EN') {
          setLanguage('en');
          return;
        }
        
        if (selectorText === 'Lietuvių' || selectorText === 'LT') {
          setLanguage('lt');
          return;
        }
        
        if (selectorText === 'Русский' || selectorText === 'RU') {
          setLanguage('ru');
          return;
        }
        
        // More general contains checks as fallback
        if (selectorText.includes('English')) {
          setLanguage('en');
          return;
        }
        
        if (selectorText.includes('Lietuvių')) {
          setLanguage('lt');
          return;
        }
        
        if (selectorText.includes('Русский')) {
          setLanguage('ru');
          return;
        }
      }
      
      // Priority 2: Check if there's an active language selection indicator
      const activeLanguage = document.querySelector('.language-active') ||
                           document.querySelector('[aria-current="true"]');
      
      if (activeLanguage) {
        const activeText = activeLanguage.innerText || '';
        
        if (activeText.includes('EN') || activeText.includes('English')) {
          setLanguage('en');
          return;
        }
        
        if (activeText.includes('LT') || activeText.includes('Lietuv')) {
          setLanguage('lt');
          return;
        }
        
        if (activeText.includes('RU') || activeText.includes('Русск')) {
          setLanguage('ru');
          return;
        }
      }
      
      // Priority 3: Check HTML lang attribute
      const htmlLang = document.documentElement.lang;
      if (htmlLang) {
        if (htmlLang === 'en' || htmlLang.startsWith('en-')) {
          setLanguage('en');
          return;
        }
        
        if (htmlLang === 'lt' || htmlLang.startsWith('lt-')) {
          setLanguage('lt');
          return;
        }
        
        if (htmlLang === 'ru' || htmlLang.startsWith('ru-')) {
          setLanguage('ru');
          return;
        }
      }
      
      // Priority 4: Check URL for language indication
      const pathname = window.location.pathname;
      if (pathname.includes('/en/') || pathname === '/en') {
        setLanguage('en');
        return;
      }
      
      if (pathname.includes('/lt/') || pathname === '/lt') {
        setLanguage('lt');
        return;
      }
      
      if (pathname.includes('/ru/') || pathname === '/ru') {
        setLanguage('ru');
        return;
      }
      
      // Priority 5: Local storage as fallback
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    } catch (e) {
      console.error('Error detecting language:', e);
    }
  };
  
  const getMessage = () => {
    switch(language) {
      case 'ru':
        return "Эта страница еще не существует, спасибо за понимание. - ePasaulis";
      case 'lt':
        return "Šis puslapis dar neegzistuoja, ačiū už supratimą. - ePasaulis";
      default:
        return "This page doesn't exist yet, thanks for understanding. - ePasaulis";
    }
  };
  
  const getButtonText = () => {
    switch(language) {
      case 'ru':
        return "Вернуться на главную";
      case 'lt':
        return "Grįžti į pagrindinį";
      default:
        return "Back to Home";
    }
  };
  
  return (
    <div style={{
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '28rem',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#0284c7',
          marginBottom: '1rem'
        }}>404</h1>
        
        <p style={{
          color: '#d1d5db',
          marginBottom: '2rem'
        }}>
          {getMessage()}
        </p>
        
        <button
          onClick={() => router.push('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            padding: '0.5rem 1rem',
            backgroundColor: '#0284c7',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>←</span>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
} 