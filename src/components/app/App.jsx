import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./App.module.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import OrderDetails from "../order-details/order-details";
import { fetchIngredients } from "../../services/ingredientsSlice";
import { createOrder, closeOrderModal } from "../../services/orderSlice";
import {
  setIngredientDetails,
  clearIngredientDetails,
} from "../../services/ingredientDetailsSlice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const dispatch = useDispatch();
  const {
    list: ingredients,
    loading,
    error,
  } = useSelector((state) => state.ingredients);
  const { currentIngredient } = useSelector((state) => state.ingredientDetails);
  const { currentOrder, isOrderModalOpen } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleOrderClick = () => {
    const ingredientIds = ingredients.map((ingredient) => ingredient._id);
    dispatch(createOrder(ingredientIds));
  };

  const handleIngredientClick = (ingredient) => {
    if (!ingredient) return;
    dispatch(setIngredientDetails(ingredient));
  };

  return (
    <>
      <AppHeader />
      <main className={styles.pageContainer}>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: {error}</div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={handleIngredientClick}
            />
            <BurgerConstructor onOrderClick={handleOrderClick} />
          </DndProvider>
        )}
      </main>
      {currentIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => dispatch(clearIngredientDetails())}
        >
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={() => dispatch(closeOrderModal())}>
          <OrderDetails order={currentOrder} />
        </Modal>
      )}
    </>
  );
}

export default App;
