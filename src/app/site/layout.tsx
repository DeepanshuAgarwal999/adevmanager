import Navbar from '@/components/site/Navbar'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const layout = (props: Props) => {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <div className=' h-full'>
                <Navbar />
                {props.children}
            </div>
        </ClerkProvider>
    )
}

export default layout