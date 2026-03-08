import { PageProps } from "fresh";
import HeaderNL from "../components/HeaderNL.tsx";

const Layout = ({ Component }: PageProps) => {
    return (
        <>
            <HeaderNL />
            <main>
            <Component />
            </main>
            </>
    );
};

export default Layout;