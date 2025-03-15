import {
  ChangeEvent,
  MouseEvent,
  FocusEvent,
  InputHTMLAttributes,
  RefObject,
  PointerEvent,
} from "react";

export type TIconTypes =
  | "CurrencyIcon"
  | "BurgerIcon"
  | "LockIcon"
  | "DragIcon"
  | "DeleteIcon"
  | "ArrowUpIcon"
  | "ArrowDownIcon"
  | "MenuIcon"
  | "CloseIcon"
  | "CheckMarkIcon"
  | "ListIcon"
  | "ProfileIcon"
  | "EditIcon"
  | "ShowIcon"
  | "HideIcon";

export interface IInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password";
  placeholder?: string;
  success?: boolean;
  error?: boolean;
  disabled?: boolean;
  icon?: TIconTypes;
  errorText?: string;
  size?: "default" | "small";
  extraClass?: string;
  name?: string;
  required?: boolean;
  onIconClick?: () => void;
  ref?: RefObject<HTMLInputElement>;
  form?: string;
  className?: string;
  children?: React.ReactNode;
  autoComplete?: string;
  onPointerEnterCapture?: (e: PointerEvent<HTMLInputElement>) => void;
  onPointerLeaveCapture?: (e: PointerEvent<HTMLInputElement>) => void;
}
