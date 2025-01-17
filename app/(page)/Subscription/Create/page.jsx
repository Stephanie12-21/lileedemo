"use client";

import { useState } from "react"

export default function Create(){
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [name, setName] = useState("")
    const createPlan = async () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', price)
        formData.append('description', description)

        const result = await fetch('/api/stripe/plan', {
            method: 'POST',
            body: formData
        })

        if(result.ok){
            console.log('Plan created', await result.json())
        }
        console.log('erreur', result)
    }
    
    return (
        <div
        >
            <h2>Nouveau plan</h2>
            <div>
                <label htmlFor="name">Nom</label>
                <input 
                    type="name" 
                    id="description"
                    onChange={(event) => setName(event.target.value)}
                    />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input 
                    type="text" 
                    id="description"
                    onChange={(event) => setDescription(event.target.value)}
                    />
            </div>
            <div>
                <label htmlFor="price">Prix</label>
                <input 
                    type="number" 
                    id="price"
                    onChange={(event) => setPrice(event.target.value)}
                />
            </div>

            <button
                onClick={createPlan}
            >
                Créer
            </button>
        </div>
    )
}