declare module 'negotiator' {
  export interface NegotiatorOptions {
    headers: Record<string, string>;
  }

  export default class Negotiator {
    constructor(request: NegotiatorOptions);
    
    /**
     * Get the most preferred language from the Accept-Language header.
     */
    language(languages?: string[]): string | undefined;
    
    /**
     * Get all languages from the Accept-Language header.
     */
    languages(): string[];
    
    /**
     * Get the most preferred encoding from the Accept-Encoding header.
     */
    encoding(encodings?: string[]): string | undefined;
    
    /**
     * Get all encodings from the Accept-Encoding header.
     */
    encodings(): string[];
    
    /**
     * Get the most preferred charset from the Accept-Charset header.
     */
    charset(charsets?: string[]): string | undefined;
    
    /**
     * Get all charsets from the Accept-Charset header.
     */
    charsets(): string[];
    
    /**
     * Get the most preferred media type from the Accept header.
     */
    mediaType(mediaTypes?: string[]): string | undefined;
    
    /**
     * Get all media types from the Accept header.
     */
    mediaTypes(): string[];
  }
} 