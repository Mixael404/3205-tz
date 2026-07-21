import type React from "react";
import type { FC } from "react";

import styles from "./MainLayout.module.scss";

interface IMainLayout {
    children: React.ReactNode,
}

const MainLayout: FC<IMainLayout> = ({ children }) => {
    return (
        <div className={styles["layout"]}>
            <div className={styles["layout__top-left"]}>{children}</div>
            <div className={styles["layout__top-right"]} />
            <div className={styles["layout__bottom"]} />
        </div>
    );
};

export default MainLayout;