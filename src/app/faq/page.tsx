'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const { t } = useLanguage();

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the order history section. There you will find tracking information for all your recent orders.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit cards (Visa, MasterCard), PayPal, and bank transfers.'
    },
    // Add more FAQs as needed
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('faq')}</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="bg-white rounded-lg shadow">
                  <Disclosure.Button className="w-full px-4 py-3 text-left flex justify-between items-center">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        open ? 'transform rotate-180' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-3 text-gray-600 border-t">
                    {faq.answer}
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  );
} 