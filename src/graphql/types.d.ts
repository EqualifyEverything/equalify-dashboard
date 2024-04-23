export interface Message {
    reportId: string;
    messageId: number;
    title: string;
    activeCount: number;
  }
  
  export interface Page {
    reportId: string;
    pageId: number;
    url: string;
    occurrencesActive: number;
  }
  
  export interface Tag {
    reportId: string;
    tagId: number;
    name: string;
    referenceCount: number;
  }