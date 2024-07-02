export interface Message {
  id: string;
  messageId: number;
  title: string;
  activeCount: number;
}

export interface Occurrence {
  messageId: number;
  title: string;
  codeSnippet: string;
  status: string;
}

export interface Page {
  id: string;
  pageId: number;
  url: string;
  occurrencesActive: number;
}

export interface Tag {
  id: string;
  tagId: number;
  name: string;
  referenceCount: number;
}

interface Node {
  pageUrl: string;
  pageId: number;
  codeSnippet: string;
  status: string;
}