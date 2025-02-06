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

  return (
    <>
      <AppHeader />
      <main className={styles.pageContainer}>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: {error}</div>
        ) : (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={(ingredient) =>
                dispatch(setIngredientDetails(ingredient))
              }
            />
            <BurgerConstructor
              ingredients={ingredients}
              onOrderClick={handleOrderClick}
            />
          </>
        )}
      </main>
      {currentIngredient && (
        <Modal
          title="Детали заказа"
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
