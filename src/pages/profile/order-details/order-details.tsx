import React from "react";
import { useParams } from "react-router-dom";
import styles from "./order-details.module.scss";

interface OrderParams {
  number: string;
}

const ProfileOrderDetails: React.FC = () => {
  const { number } = useParams<keyof OrderParams>() as OrderParams;

  return (
    <div className={styles.container}>
      <p className="text text_type_main-medium">Заказ #{number}</p>
    </div>
  );
};

export default ProfileOrderDetails;
