declare module 'language-list' {
  export default class LanguageList {
    getData(): Record<string, string>
    getLanguageCode(languageName: string): string | undefined
    getLanguageCodes(): string[]
    getLanguageName(languageCode: string): string | undefined
    getLanguageNames(): string[]
  }
}

declare module 'eslint-plugin-import' {}
