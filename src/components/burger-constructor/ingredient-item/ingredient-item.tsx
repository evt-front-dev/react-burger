import React, { useRef } from "react";
import styles from "./ingredient-item.module.scss";
import {
  ConstructorElement,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { removeIngredient, moveIngredient } from "services/constructorSlice";
import { decrementIngredientCount } from "services/ingredientsSlice";
import { useDrag, useDrop } from "react-dnd";
import { DND_TYPES } from "utils/constants";
import { ConstructorIngredient } from "../burger-constructor";
import { useAppDispatch } from "hooks/redux";

interface IngredientItemProps {
  item: ConstructorIngredient;
  index: number;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
  name: string;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ item, index }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPES.CONSTRUCTOR_ITEM,
    item: (): DragItem => ({
      id: item.uniqueId,
      index,
      type: item.type,
      name: item.name,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: item.type !== "bun",
  });

  const [, drop] = useDrop({
    accept: DND_TYPES.CONSTRUCTOR_ITEM,
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) return;
      if (draggedItem.type === "bun") return;
      if (draggedItem.index === index) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

      dispatch(moveIngredient({ dragIndex, hoverIndex }));
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={styles.resizingListItem}
      style={{
        opacity: isDragging ? 0.3 : 1,
        cursor: item.type === "bun" ? "default" : "grab",
      }}
      data-testid="constructor-ingredient"
    >
      {item.type !== "bun" && <DragIcon className="mr-2" type="primary" />}
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => {
          dispatch(removeIngredient(item.uniqueId));
          dispatch(decrementIngredientCount(item._id));
        }}
      />
    </li>
  );
};

export default IngredientItem;
