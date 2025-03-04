import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps, GetServerSideProps } from 'next';

type TranslationNamespaces = 'common' | 'admin' | 'auth' | 'products' | 'cart' | 'profile';

export const makeStaticProps = (namespaces: TranslationNamespaces[] = ['common']): GetStaticProps => {
  return async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale || 'en', namespaces)),
    },
  });
};

export const makeServerSideProps = (
  namespaces: TranslationNamespaces[] = ['common'],
  handler?: GetServerSideProps
): GetServerSideProps => {
  return async (context) => {
    const locale = context.locale || 'en';
    
    // If there's a handler, call it first
    if (handler) {
      const result = await handler(context);
      
      // If redirect or notFound, return as is
      if ('redirect' in result || 'notFound' in result) {
        return result;
      }
      
      // Merge handler props with translations
      return {
        props: {
          ...result.props,
          ...(await serverSideTranslations(locale, namespaces)),
        },
      };
    }
    
    // If no handler, just return translations
    return {
      props: {
        ...(await serverSideTranslations(locale, namespaces)),
      },
    };
  };
}; 