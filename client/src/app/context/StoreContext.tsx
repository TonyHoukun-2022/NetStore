import { PropsWithChildren, createContext, useContext, useState } from "react"
import { Basket } from "../models/basket"

interface StoreContextValue {
  basket: Basket | null
  setBasket: (basket: Basket) => void
  removeItem: (productId: number, quantity: number) => void
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined)

//custom hook to consume context
export const useStoreContext = () => {
  const context = useContext(StoreContext)

  if (context === undefined) {
    throw Error('We do not seem to be inside the context provider')
  }

  return context
}

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [basket, setBasket] = useState<Basket | null>(null)

  const removeItem = (productId: number, quantity: number) => {
    if (!basket) return
    //use a copy of the items in basket state to do logic
    const items = [...basket.items]
    const itemIndex = items.findIndex(i => i.productId === productId)
    //if there is an item to remove
    if (itemIndex >= 0) {
      //decrease by given quantity
      items[itemIndex].quantity -= quantity
      //basket.item.quantity = 0, remove that basketItem
      if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1)
      setBasket(preState => {
        return { ...preState!, items }
      })
    }
  }

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  )
}
