import { createSignal } from "solid-js";

const createFoodSeletionStore = () => {
    const [foodSelection, setFoodSelection] = createSignal([])
    return {
        foodSelection,
        addFood : food => setFoodSelection(prev => prev.some(i => i.code == food.code) ? prev : [...prev, food] )
        ,
        deleteFood : code => setFoodSelection(prev =>  prev.filter(food => food.code !== code)),
        resetFoodSelection : () => setFoodSelection([])
    }
}

export const {foodSelection, addFood, deleteFood, resetFoodSelection } = createFoodSeletionStore()