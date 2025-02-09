import Languages from 'language-list'

const languages = new Languages()
const codes = languages.getLanguageCodes()
const languagesWithCodes = codes.map((code) => ({
  code,
  language: languages.getLanguageName(code),
}))

console.log(languagesWithCodes)
