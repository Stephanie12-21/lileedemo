"use client"

import { useState, useEffect } from "react";

export default function Delete(){
    const [deleted, setDeleted] = useState(false)

    useEffect(() => {
        if(! deleted){
            (async() => {
                const result = await fetch('/api/stripe/delete_users')
                console.log(await result.json())
                setDeleted(true)
            })()
        }
    }, [])

    return deleted ? <p>deleted</p> : <p>deleting...</p>
}