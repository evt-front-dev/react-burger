import React from "react";
import { useParams } from "react-router-dom";
import styles from "./order-details.module.scss";

const ProfileOrderDetails = () => {
  const { number } = useParams();

  return (
    <div className={styles.container}>
      <p className="text text_type_main-medium">Заказ #{number}</p>
    </div>
  );
};

export default ProfileOrderDetails;
