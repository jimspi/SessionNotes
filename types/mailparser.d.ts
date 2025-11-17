declare module 'mailparser' {
  export interface EmailAddress {
    value: Array<{
      address: string;
      name: string;
    }>;
    html: string;
    text: string;
  }

  export interface ParsedMail {
    attachments: any[];
    headers: Map<string, any>;
    html: string | false;
    text?: string;
    textAsHtml?: string;
    subject?: string;
    date?: Date;
    to?: EmailAddress;
    from?: EmailAddress;
    cc?: EmailAddress;
    bcc?: EmailAddress;
    messageId?: string;
    inReplyTo?: string;
    references?: string | string[];
    replyTo?: EmailAddress;
  }

  export interface Options {
    streamAttachments?: boolean;
    [key: string]: any;
  }

  export function simpleParser(
    source: Buffer | string,
    options?: Options
  ): Promise<ParsedMail>;
}
