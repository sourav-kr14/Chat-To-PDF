// 'use client'

// import { SignedIn, UserButton } from '@clerk/nextjs';
// import Link from 'next/link';
// import React from 'react';
// import { Button } from './ui/button';
// import { FilePlus2 } from 'lucide-react';

// export default function Header() {
//   return (
//     <div className="flex justify-between bg-white shadow-sm">
//       <Link href='/dashboard' className='text-2xl font-semibold'>
//         Chat to <span className='text-indigo-600'>PDF</span>
//       </Link>
// {/* 
//       <SignedIn> */}
//         <div className="flex items-center gap-4">
//           <Button asChild variant="link" className=''>
//             <Link href="/dashboard/pricing">Pricing</Link>
//           </Button>
//             <Button asChild variant="outline" className='m-2'>
//             <Link href="/dashboard">My Documents</Link>
//           </Button>
//             <Button asChild variant="outline" className='border-indigo-600'>
//               <Link href="/dashboard/upload">
//             <FilePlus2 className='text-indigo-600'/>
//             </Link>
//           </Button>
//           <UserButton />
//         </div>
//       {/* </SignedIn> */}
//     </div>
//   );
// }

'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { FilePlus2 } from 'lucide-react';
import UpgradeButton from './UpgradeButton';

export default function Header() {
  return (
    <div className="flex justify-between bg-white shadow-sm px-4 py-2">
      <Link href='/dashboard' className='text-2xl font-semibold'>
        Chat to <span className='text-indigo-600'>PDF</span>
      </Link>

      <SignedIn>
        <div className="flex items-center gap-4">
          <Button asChild variant="link">
            <Link href="/dashboard/pricing">Pricing</Link>
          </Button>
          <Button asChild variant="outline" className='m-2'>
            <Link href="/dashboard">My Documents</Link>
          </Button>
          <Button asChild variant="outline" className='border-indigo-600'>
            <Link href="/dashboard/upload">
              <FilePlus2 className='text-indigo-600 items-center' />
        
            </Link>
          </Button>
          <UpgradeButton  />
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
    </div>
  );
}

