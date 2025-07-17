'use client'
import React, { useTransition } from 'react'
import useSubscription from '@/hooks/useSubscription'
import { Button } from './ui/button'
import Link from 'next/link'
import { Loader2Icon, StarIcon } from 'lucide-react'
import { createStripePortal } from '@/actions/createStripePortal'
import { useRouter } from 'next/navigation'

function UpgradeButton() {
  const { hasActiveMembership, loading } = useSubscription()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()


  const handleAccount = () => {
    startTransition(async () => {
      const url = await createStripePortal()
      router.push(url)
    })
  }


  if (loading) {
    return (
      <Button variant="default" className="border-indigo-600">
        <Loader2Icon className="animate-spin" />
      </Button>
    )
  }


  if (!hasActiveMembership) {
    return (
      <Button asChild variant="default" className="border-indigo-600">
        <Link href="/dashboard/upgrade">
          Upgrade <StarIcon className="ml-3 fill-indigo-600 text-white" />
        </Link>
      </Button>
    )
  }

  return (
    <Button
      onClick={handleAccount}
      disabled={isPending}
      variant="default"
      className="border-indigo-600 bg-indigo-600 text-white"
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <span>
          <span className="font-extrabold">PRO</span> Account
        </span>
      )}
    </Button>
  )
}

export default UpgradeButton
