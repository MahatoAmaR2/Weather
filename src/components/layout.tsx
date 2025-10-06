import  type {  PropsWithChildren } from "react";
import Header from "./header";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="bg-gradient-to-br from-background to-muted">
            <Header>

            </Header>

            <main className="min-h-screen container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="border-t backdrop-blue py-12 supports-[backdrop-filter]:bg-bacground/60">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p className="text-sm">© 2025 Climate App. All rights reserved.</p>
                </div>
            </footer>
            
        </div>

    )
}

export default Layout;