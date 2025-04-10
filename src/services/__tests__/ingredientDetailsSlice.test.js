import ingredientDetailsReducer, {
  setIngredientDetails,
  clearIngredientDetails,
} from "../ingredientDetailsSlice";

describe("ingredientDetails reducer", () => {
  const initialState = {
    currentIngredient: null,
  };

  it("should return the initial state", () => {
    expect(ingredientDetailsReducer(undefined, { type: undefined })).toEqual(
      initialState
    );
  });

  it("should handle setIngredientDetails", () => {
    const ingredient = {
      _id: "123",
      name: "Test Ingredient",
      type: "sauce",
      proteins: 10,
      fat: 5,
      carbohydrates: 15,
      calories: 100,
      price: 50,
      image: "image-url",
      image_mobile: "mobile-image-url",
      image_large: "large-image-url",
      __v: 0,
      count: 0,
    };

    const newState = ingredientDetailsReducer(
      initialState,
      setIngredientDetails(ingredient)
    );

    expect(newState.currentIngredient).toEqual(ingredient);
  });

  it("should handle clearIngredientDetails", () => {
    const stateWithIngredient = {
      currentIngredient: {
        _id: "123",
        name: "Test Ingredient",
        type: "sauce",
        proteins: 10,
        fat: 5,
        carbohydrates: 15,
        calories: 100,
        price: 50,
        image: "image-url",
        image_mobile: "mobile-image-url",
        image_large: "large-image-url",
        __v: 0,
        count: 0,
      },
    };

    const newState = ingredientDetailsReducer(
      stateWithIngredient,
      clearIngredientDetails()
    );

    expect(newState.currentIngredient).toBeNull();
  });
});
