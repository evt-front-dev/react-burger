import ingredientsReducer, {
  fetchIngredients,
  incrementIngredientCount,
  decrementIngredientCount,
  resetIngredientCounts,
} from "../ingredientsSlice";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

describe("ingredients reducer", () => {
  it("should return the initial state", () => {
    expect(ingredientsReducer(undefined, { type: undefined })).toEqual(
      initialState
    );
  });

  it("should handle incrementIngredientCount for non-bun ingredient", () => {
    const ingredient = {
      _id: "123",
      type: "sauce",
      count: 0,
    };
    const state = {
      ...initialState,
      list: [ingredient],
    };

    const newState = ingredientsReducer(state, incrementIngredientCount("123"));
    expect(newState.list[0].count).toBe(1);
  });

  it("should handle incrementIngredientCount for bun ingredient", () => {
    const bunIngredient = {
      _id: "bun1",
      type: "bun",
      count: 0,
    };
    const otherBun = {
      _id: "bun2",
      type: "bun",
      count: 2,
    };
    const state = {
      ...initialState,
      list: [bunIngredient, otherBun],
    };

    const newState = ingredientsReducer(
      state,
      incrementIngredientCount("bun1")
    );
    expect(newState.list[0].count).toBe(2);
    expect(newState.list[1].count).toBe(0);
  });

  it("should handle decrementIngredientCount for non-bun ingredient", () => {
    const ingredient = {
      _id: "123",
      type: "sauce",
      count: 2,
    };
    const state = {
      ...initialState,
      list: [ingredient],
    };

    const newState = ingredientsReducer(state, decrementIngredientCount("123"));
    expect(newState.list[0].count).toBe(1);
  });

  it("should handle decrementIngredientCount for bun ingredient", () => {
    const bunIngredient = {
      _id: "bun1",
      type: "bun",
      count: 2,
    };
    const state = {
      ...initialState,
      list: [bunIngredient],
    };

    const newState = ingredientsReducer(
      state,
      decrementIngredientCount("bun1")
    );
    expect(newState.list[0].count).toBe(0);
  });

  it("should handle resetIngredientCounts", () => {
    const state = {
      ...initialState,
      list: [
        { _id: "1", count: 2 },
        { _id: "2", count: 1 },
      ],
    };

    const newState = ingredientsReducer(state, resetIngredientCounts());
    expect(newState.list[0].count).toBe(0);
    expect(newState.list[1].count).toBe(0);
  });

  it("should handle fetchIngredients.pending", () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      list: [],
      loading: true,
      error: null,
    });
  });

  it("should handle fetchIngredients.fulfilled", () => {
    const ingredients = [
      { _id: "1", name: "Ingredient 1", count: 0 },
      { _id: "2", name: "Ingredient 2", count: 0 },
    ];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredients,
    };

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      list: ingredients,
      loading: false,
      error: null,
    });
  });

  it("should handle fetchIngredients.rejected", () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: "Failed to fetch" },
    };

    const state = ingredientsReducer(initialState, action);

    expect(state).toEqual({
      list: [],
      loading: false,
      error: "Failed to fetch",
    });
  });
});
