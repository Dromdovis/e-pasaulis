'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const { t } = useLanguage();

  // Use the same set of questions for all languages to ensure consistency
  const faqs = [
    {
      question: t('faq_question_1'),
      answer: t('faq_answer_1')
    },
    {
      question: t('faq_question_2'),
      answer: t('faq_answer_2')
    },
    {
      question: t('faq_question_3'),
      answer: t('faq_answer_3')
    },
    {
      question: t('faq_question_4'),
      answer: t('faq_answer_4')
    },
    {
      question: t('faq_question_5'),
      answer: t('faq_answer_5')
    },
    {
      question: t('faq_question_6'),
      answer: t('faq_answer_6')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('faq_page_title')}</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Disclosure key={index}>
              {({ open }) => (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <Disclosure.Button className="w-full px-4 py-3 text-left flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                        open ? 'transform rotate-180' : ''
                      }`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 py-3 text-gray-600 dark:text-gray-300 border-t dark:border-gray-700">
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