import type React from "react";
import type { FC } from "react";

import styles from "./MainLayout.module.scss";

interface IMainLayout {
    children: React.ReactNode,
}

const MainLayout: FC<IMainLayout> = ({ children }) => {
    return (
        <div className={styles["layout"]}>
            {children}
        </div>
    );
};

export default MainLayout;