import type { ReactNode } from "react";
import './default.scss'

export default function DefaultLayout({ children }: { children?: ReactNode }) {
    return(
        <div className="default-layout">
            {children}
        </div>
    )
}