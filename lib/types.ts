import type { ExtractAndTranslateWordsOutput } from "@/ai/flows/extract-and-translate-words";

export type AnalysisResult = ExtractAndTranslateWordsOutput;
//export type Word = AnalysisResult["words"][number];
//export type Phrase = AnalysisResult["phrases"][number];

export interface Word {
  chinese: string;
  pinyin: string;
  translation: string;
  text?: string;
  word?: string;
  meaning?: string;
  usage?: {
    chinese: string;
    pinyin: string;
    translation: string;
    text?: string;
    word?: string;
    meaning?: string;
  };
  // possibly other fields like text, frequency, etc. — but NOT "meaning"
}

export interface Phrase {
  text?: string; // or chinese / phrase / content
  pinyin?: string;
  translation: string;
  meaning?: string;
  phrase?: string; // ← this is probably the English meaning
  // or possibly: meaning?: string;
  usage?: {
    text?: string; // or chinese / phrase / content
    pinyin?: string;
    translation: string;
    meaning?: string;
    phrase?: string;
  };
}

export type TInvitee = {
  id: string;

  // Invitee info
  fullName: string;

  // Wedding table info
  tableNumber: number;

  // People sitting at the same table
  tableMates: string[];

  // Optional extras
  phoneNumber?: string;
  seatNumber?: number;
  qrCode?: string;

  // RSVP
  confirmed?: boolean;

  // Metadata
  createdAt?: Date;

  status: "Mr." | "Mme" | "Couple";
};

export type TInviteeStatus = "Mr." | "Mme" | "Couple";
