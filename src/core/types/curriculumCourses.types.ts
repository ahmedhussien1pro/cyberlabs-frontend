// types.ts

import type { TranslatedText } from "./common.types";

/* ---------------------------------- */
/* Base */
/* ---------------------------------- */

export type ElementType =
  | "title"
  | "subtitle"
  | "text"
  | "image"
  | "video"
  | "list"
  | "orderedList"
  | "code"
  | "terminal"
  | "note"
  | "table"
  | "hr"
  | "button";

export interface BaseElement {
  type: ElementType;
}

/* ---------------------------------- */
/* Simple Text Elements */
/* ---------------------------------- */

export interface TitleElement extends BaseElement {
  type: "title";
  value: TranslatedText;
}

export interface SubtitleElement extends BaseElement {
  type: "subtitle";
  value: TranslatedText;
}

export interface TextElement extends BaseElement {
  type: "text";
  value: TranslatedText;
}

/* ---------------------------------- */
/* Media */
/* ---------------------------------- */

export interface ImageElement extends BaseElement {
  type: "image";
  srcKey: string;
  size?: "small" | "medium" | "large";
}

export interface VideoElement extends BaseElement {
  type: "video";
  url: string;
  title?: TranslatedText;
  autoPlay?: boolean;
}

/* ---------------------------------- */
/* Lists */
/* ---------------------------------- */

/**
 * يدعم الشكلين:
 * 1) Array of TranslatedText
 * 2) Object فيه en[] و ar[]
 */
export interface ListElement extends BaseElement {
  type: "list";
  items:
    | TranslatedText[]
    | {
        en: string[];
        ar: string[];
      };
}

/* ---------------------------------- */
/* Ordered List (Advanced) */
/* ---------------------------------- */

export interface OrderedListItem {
  subtitle: TranslatedText;
  text: TranslatedText;
  example?: TranslatedText;
  image?: {
    srcKey: string;
    size?: "small" | "medium" | "large";
  };
}

export interface OrderedListElement extends BaseElement {
  type: "orderedList";
  items: OrderedListItem[];
}

/* ---------------------------------- */
/* Code / Terminal */
/* ---------------------------------- */

export interface CodeElement extends BaseElement {
  type: "code";
  code: string;
  language?: string;
}

export interface TerminalElement extends BaseElement {
  type: "terminal";
  value: string;
  label?: TranslatedText;
}

/* ---------------------------------- */
/* Notes */
/* ---------------------------------- */

export interface NoteElement extends BaseElement {
  type: "note";
  value: TranslatedText;
  link?: string;
  isLab?: boolean;
}

/* ---------------------------------- */
/* Table */
/* ---------------------------------- */

export interface TableElement extends BaseElement {
  type: "table";
  headers: TranslatedText[];
  rows: TranslatedText[][];
}

/* ---------------------------------- */
/* HR */
/* ---------------------------------- */

export interface HrElement extends BaseElement {
  type: "hr";
}

/* ---------------------------------- */
/* Button */
/* ---------------------------------- */

export interface ButtonElement extends BaseElement {
  type: "button";
  label: TranslatedText;
  href: string;
  newTab?: boolean;
}

/* ---------------------------------- */
/* Union */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* Topic */
/* ---------------------------------- */

export interface Topic {
  id: string;
  title: TranslatedText;
  elements: CourseElement[];
}

/* ---------------------------------- */
/* Course */
/* ---------------------------------- */

export interface CourseCurriculumProps {
  topics: Topic[];
  imageMap: Record<string, string>;
  labsLink?: string;
}
