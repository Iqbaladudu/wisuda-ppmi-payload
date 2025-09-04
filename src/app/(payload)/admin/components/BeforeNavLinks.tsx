import { Link } from 'lucide-react'

export default function BeforeNavLinks() {
  return (
    <Link
      href="/api/google/init"
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
    >
      Connects to Google
    </Link>
  )
}
