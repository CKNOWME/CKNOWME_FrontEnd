import { PageProps } from "fresh";
import Header from "../../components/Header.tsx";

const Layout = ({ Component }: PageProps) => {
    return (
        <>
            <Header />
            <main>
            <Component />
            </main>
            </>
    );
};

export default Layout;