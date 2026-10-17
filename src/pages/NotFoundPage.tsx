import { Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full items-center justify-center bg-bg">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Button variant="primary" onClick={() => navigate('/chats')}>
            Back to chats
          </Button>
        }
      />
    </div>
  )
}
