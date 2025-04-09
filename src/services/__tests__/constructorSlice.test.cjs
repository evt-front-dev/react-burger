import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setConstructorIngredients,
  resetConstructor,
} from "../constructorSlice";

describe("constructor reducer", () => {
  const initialState = {
    ingredients: [],
  };

  it("should return the initial state", () => {
    expect(constructorReducer(undefined, { type: undefined })).toEqual(
      initialState
    );
  });

  it("should handle addIngredient with non-bun", () => {
    const ingredient = {
      _id: "123",
      type: "sauce",
      uniqueId: "unique123",
      name: "Test sauce",
    };

    const newState = constructorReducer(
      initialState,
      addIngredient(ingredient)
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(ingredient);
  });

  it("should handle addIngredient with bun and replace existing bun", () => {
    const oldBun = {
      _id: "bun1",
      type: "bun",
      uniqueId: "unique-bun1",
      name: "Old bun",
    };

    const newBun = {
      _id: "bun2",
      type: "bun",
      uniqueId: "unique-bun2",
      name: "New bun",
    };

    const sauce = {
      _id: "123",
      type: "sauce",
      uniqueId: "unique123",
      name: "Test sauce",
    };

    const stateWithOldBun = {
      ingredients: [oldBun, sauce],
    };

    const newState = constructorReducer(stateWithOldBun, addIngredient(newBun));

    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients).toContainEqual(newBun);
    expect(newState.ingredients).toContainEqual(sauce);
    expect(newState.ingredients).not.toContainEqual(oldBun);
  });

  it("should handle removeIngredient", () => {
    const ingredient1 = {
      _id: "123",
      type: "sauce",
      uniqueId: "unique123",
      name: "Test sauce",
    };

    const ingredient2 = {
      _id: "456",
      type: "main",
      uniqueId: "unique456",
      name: "Test main",
    };

    const state = {
      ingredients: [ingredient1, ingredient2],
    };

    const newState = constructorReducer(state, removeIngredient("unique123"));

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(ingredient2);
  });

  it("should handle moveIngredient", () => {
    const bun = {
      _id: "bun1",
      type: "bun",
      uniqueId: "unique-bun",
      name: "Test bun",
    };

    const ingredient1 = {
      _id: "123",
      type: "sauce",
      uniqueId: "unique123",
      name: "Test sauce",
    };

    const ingredient2 = {
      _id: "456",
      type: "main",
      uniqueId: "unique456",
      name: "Test main",
    };

    const state = {
      ingredients: [bun, ingredient1, ingredient2],
    };

    const newState = constructorReducer(
      state,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(newState.ingredients).toHaveLength(3);
    expect(newState.ingredients[0]).toEqual(bun);
    expect(newState.ingredients[1]).toEqual(ingredient2);
    expect(newState.ingredients[2]).toEqual(ingredient1);
  });

  it("should handle setConstructorIngredients", () => {
    const newIngredients = [
      {
        _id: "bun1",
        type: "bun",
        uniqueId: "unique-bun",
        name: "Test bun",
      },
      {
        _id: "123",
        type: "sauce",
        uniqueId: "unique123",
        name: "Test sauce",
      },
    ];

    const newState = constructorReducer(
      initialState,
      setConstructorIngredients(newIngredients)
    );

    expect(newState.ingredients).toEqual(newIngredients);
  });

  it("should handle resetConstructor", () => {
    const state = {
      ingredients: [
        {
          _id: "bun1",
          type: "bun",
          uniqueId: "unique-bun",
          name: "Test bun",
        },
        {
          _id: "123",
          type: "sauce",
          uniqueId: "unique123",
          name: "Test sauce",
        },
      ],
    };

    const newState = constructorReducer(state, resetConstructor());

    expect(newState.ingredients).toEqual([]);
  });
});
