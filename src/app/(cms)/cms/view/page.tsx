import { LoremIpsum } from 'lorem-ipsum'

export default function Page() {
  return <>{new LoremIpsum().generateParagraphs(100)}</>
}
