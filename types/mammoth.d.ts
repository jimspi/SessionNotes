declare module 'mammoth' {
  export interface ConversionResult {
    value: string;
    messages: ConversionMessage[];
  }

  export interface ConversionMessage {
    type: string;
    message: string;
  }

  export interface Options {
    buffer?: Buffer;
    path?: string;
    arrayBuffer?: ArrayBuffer;
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: any;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    [key: string]: any;
  }

  export function extractRawText(options: Options): Promise<ConversionResult>;
  export function convertToHtml(options: Options): Promise<ConversionResult>;
  export function convertToMarkdown(options: Options): Promise<ConversionResult>;
}
