import React, { useEffect, useState } from "react";
import "./App.css";
import AppHeader from "../app-header/app-header";
import BurgerIngredients from "../burger-ingredients/burger-ingredients";
import BurgerConstructor from "../burger-constructor/burger-constructor";
import Modal from "../modal/modal";
import IngredientDetails from "../ingredient-details/ingredient-details";
import OrderDetails from "../order-details/order-details";

const API_URL = "https://norma.nomoreparties.space/api/ingredients";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке ингредиентов");
        }
        return response.json();
      })
      .then((data) => {
        setIngredients(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const openIngredientModal = (ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const closeIngredientModal = () => {
    setSelectedIngredient(null);
  };

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <>
      <AppHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "calc(100% - 96px)",
        }}
      >
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: {error}</div>
        ) : (
          <>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={openIngredientModal}
            />
            <BurgerConstructor
              ingredients={ingredients}
              onOrderClick={openOrderModal}
            />
          </>
        )}
      </div>
      {selectedIngredient && (
        <Modal title="Детали заказа" onClose={closeIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
}

export default App;
