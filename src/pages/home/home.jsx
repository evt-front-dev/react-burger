import React from "react";
import styles from "./home.module.scss";
import BurgerIngredients from "../../components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "../../components/burger-constructor/burger-constructor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector, useDispatch } from "react-redux";
import { setIngredientDetails } from "../../services/ingredientDetailsSlice";
import { createOrder } from "../../services/orderSlice";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    list: ingredients,
    loading,
    error,
  } = useSelector((state) => state.ingredients);

  const handleIngredientClick = (ingredient) => {
    if (!ingredient) return;
    dispatch(setIngredientDetails(ingredient));
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  const handleOrderClick = () => {
    const ingredientIds = ingredients.map((ingredient) => ingredient._id);
    dispatch(createOrder(ingredientIds));
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <main className={styles.pageContainer}>
      <DndProvider backend={HTML5Backend}>
        <BurgerIngredients
          ingredients={ingredients}
          onIngredientClick={handleIngredientClick}
        />
        <BurgerConstructor onOrderClick={handleOrderClick} />
      </DndProvider>
    </main>
  );
};

export default HomePage;
