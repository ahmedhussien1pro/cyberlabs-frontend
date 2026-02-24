import type { TranslatedText } from './common.types';

export type ElementType =
  | 'title'
  | 'subtitle'
  | 'text'
  | 'image'
  | 'video'
  | 'list'
  | 'orderedList'
  | 'code'
  | 'terminal'
  | 'note'
  | 'table'
  | 'hr'
  | 'button';

export interface BaseElement {
  id?: string | number;
  type: ElementType;
}

// ── Text ────────────────────────────────────────────────────
export interface TitleElement extends BaseElement {
  type: 'title';
  value: TranslatedText;
}
export interface SubtitleElement extends BaseElement {
  type: 'subtitle';
  value: TranslatedText;
}
export interface TextElement extends BaseElement {
  type: 'text';
  value: TranslatedText;
}

// ── Media ───────────────────────────────────────────────────
export interface ImageElement extends BaseElement {
  type: 'image';
  imageUrl?: string; // JSON from R2 uses this
  srcKey?: string; // legacy key-based
  imageMode?: 'url' | 'key';
  size?: 'small' | 'medium' | 'large' | 'full';
  alt?: TranslatedText;
}

export interface VideoElement extends BaseElement {
  type: 'video';
  url: string;
  title?: TranslatedText;
  autoPlay?: boolean;
}

// ── Lists ───────────────────────────────────────────────────
export type I18nArray = { en: string[]; ar: string[] };

export interface ListElement extends BaseElement {
  type: 'list';
  title?: TranslatedText;
  items: TranslatedText[] | I18nArray;
}

export interface OrderedListItem {
  subtitle: TranslatedText;
  text: TranslatedText;
  example?: TranslatedText;
  image?: {
    srcKey?: string;
    imageUrl?: string;
    size?: 'small' | 'medium' | 'large';
  };
}

export interface OrderedListElement extends BaseElement {
  type: 'orderedList';
  title?: TranslatedText;
  items: OrderedListItem[];
}

// ── Code / Terminal ─────────────────────────────────────────
export interface CodeElement extends BaseElement {
  type: 'code';
  value?: string; // JSON uses this
  code?: string; // legacy
  language?: string;
}

export interface TerminalElement extends BaseElement {
  type: 'terminal';
  value: string;
  label?: TranslatedText;
}

// ── Notes ───────────────────────────────────────────────────
export type NoteVariant = 'info' | 'warning' | 'danger' | 'success';

export interface NoteElement extends BaseElement {
  type: 'note';
  noteType?: NoteVariant;
  value: TranslatedText;
  link?: string;
  isLab?: boolean;
}

// ── Table ───────────────────────────────────────────────────
export interface TableElement extends BaseElement {
  type: 'table';
  title?: TranslatedText;
  headers: TranslatedText[] | I18nArray;
  rows: (TranslatedText[] | I18nArray)[];
}

// ── Misc ────────────────────────────────────────────────────
export interface HrElement extends BaseElement {
  type: 'hr';
}
export interface ButtonElement extends BaseElement {
  type: 'button';
  label: TranslatedText;
  href: string;
  newTab?: boolean;
}

// ── Union ───────────────────────────────────────────────────
export type CourseElement =
  | TitleElement
  | SubtitleElement
  | TextElement
  | ImageElement
  | VideoElement
  | ListElement
  | OrderedListElement
  | CodeElement
  | TerminalElement
  | NoteElement
  | TableElement
  | HrElement
  | ButtonElement;

// ── Topic ───────────────────────────────────────────────────
export interface Topic {
  id: string;
  title: TranslatedText;
  elements: CourseElement[];
}
