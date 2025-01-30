import React from "react";
import style from "./structure.module.scss";

function Structure({ label, value }) {
  return (
    <div
      className={`text text_type_main-default text_color_inactive ${style.block}`}
    >
      {label}
      <p className="text text_type_digits-default">{value}</p>
    </div>
  );
}

export default Structure;
