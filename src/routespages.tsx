import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastrar_produto from "./routes/Cadastrar_produto/Cadastrar_produto";
import Configuracao from "./routes/Configuracao/Configuracao";
import Lista_produtos from "./routes/Lista_produtos/Lista_produtos";
import Integracao from "./routes/Configuracao/integracao";


export default function RoutesPages() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Cadastrar_produto/>} />
                <Route path="/Cadastrar_produto" element={<Cadastrar_produto/>} />
                <Route path="/Lista_produtos" element={<Lista_produtos/>} />;
                <Route path="/configuracoes" element={<Configuracao/>} />
                <Route path="/Integracao" element={<Integracao/>} />
            </Routes>
        </BrowserRouter>
    );
}