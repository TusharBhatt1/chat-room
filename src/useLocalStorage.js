import { useEffect, useState } from "react"


export function useLocalStorage(key, initialValue) {

    const [value, setValue] =useState(()=>{
        let updatedValue = JSON.parse(localStorage.getItem(key))
        if(updatedValue) return updatedValue
        return initialValue
    })

    useEffect(()=>{
        localStorage.setItem(key,JSON.stringify(value))
    },[value,key])

  return [value,setValue]
}
