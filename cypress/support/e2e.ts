import "./commands";

declare global {
  interface Window {
    store: {
      getState: () => {
        ingredients: {
          list: Array<{
            _id: string;
            type: string;
            [key: string]: any;
          }>;
        };
        constructor: {
          ingredients: Array<{
            _id: string;
            type: string;
            uniqueId: string;
            [key: string]: any;
          }>;
        };
      };
      dispatch: (action: any) => void;
    };
  }
}
