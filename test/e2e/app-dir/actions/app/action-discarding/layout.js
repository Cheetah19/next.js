import { unstable_cache } from 'next/cache'
import Link from 'next/link'

const cachedRandom = unstable_cache(() => Math.random(), [], {
  tags: ['cached-random'],
})

export default function Layout({ children }) {
  return (
    <div>
      <div>
        Cached Random: <span id="cached-random">{cachedRandom()}</span>
      </div>
      <div>
        <Link id="navigate-destination" href="/action-discarding/destination">
          Navigate to Destination
        </Link>
      </div>
      {children}
    </div>
  )
}
