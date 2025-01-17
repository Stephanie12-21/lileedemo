"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Subscription(){
    const [plans, setPlans] = useState([])
    const router = useRouter()

    useEffect(() => {
        (
            async () => {
            const result = await fetch('/api/subscription/')
            
            setPlans(await result.json())
        }
        )()

    }, [])

    const handleCheckout = async (planId, event) => {
        const formData = new FormData()
        formData.append('planId', planId)
        const result = await fetch('/api/subscription/checkout', {
            method: 'POST',
            body: formData
        })

        router.push((await result.json()).url)
    }

    const setupCustomerAccount = async () => {
        const result = await fetch('/api/stripe/customer')
        router.push((await result.json()).url)
    }

    return plans.length === 0 ? 'loading...' : (
        <>
            {plans.map(plan => 
            <div key={plan.id}>
                <h1>{plan.name}</h1>
                <p>{plan.description}</p>
                <p>{plan.price} Euro par mois</p>
                <button
                    id={plan.id}
                    onClick={event => handleCheckout(plan.id, event)}
                    >
                    Acheter
                </button>
            </div>
            )}
            <hr />

            <button
                onClick={setupCustomerAccount}
            >
                Setup customer account
            </button>
            </>
        )
}