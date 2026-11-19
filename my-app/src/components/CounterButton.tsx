import { useState } from "react"

export const CounterButton = () => {
    const [count, setCount] = useState<Number>(0);
    return <button
            type="button"
            className="counter"
            
}