import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Main Page</h1>
      <Link href="/intercept">Goto Intercept</Link>
    </div>
  )
}
