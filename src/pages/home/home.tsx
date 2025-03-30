import React from "react";
import styles from "./home.module.scss";
import BurgerIngredients from "components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "components/burger-constructor/burger-constructor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector, useDispatch } from "react-redux";
import { setIngredientDetails } from "services/ingredientDetailsSlice";
import { createOrder } from "services/orderSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Ingredient } from "services/ingredientsSlice";
import { AppDispatch, RootState } from "store/store";

interface IngredientsState {
  list: Ingredient[];
  loading: boolean;
  error: string | null;
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    list: ingredients,
    loading,
    error,
  } = useSelector<RootState, IngredientsState>((state) => state.ingredients);

  const handleIngredientClick = (ingredient: Ingredient) => {
    if (!ingredient) return;
    dispatch(setIngredientDetails(ingredient));
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  const handleOrderClick = () => {
    console.log("Нажали на создание заказа");
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
