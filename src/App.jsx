import "./App.css";
import AppHeader from "./components/app-header/app-header";
import BurgerIngredients from "./components/burger-ingredients/burger-ingredients";
import BurgerConstructor from "./components/burger-constructor/burger-constructor";

function App() {
  return (
    <>
      <AppHeader />
      <div style={{ display: "flex", justifyContent: "space-between", height: "calc(100% - 96px)" }}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </>
  );
}

export default App;
