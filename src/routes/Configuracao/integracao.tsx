import { useState, useRef, useEffect } from 'react';
import './Configuracao.css';

import Logo from '../../img/logoaleximports.png'
import icon_copy from "../../img/Copy.png";

import cadastrar_black from "../../img/cadastrar_black.png";
import lista_black from "../../img/lista_black.png";
import configuracao_black from "../../img/configuracao_black.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Integracao() {
   const [open, setOpen] = useState(false);
   const navigate = useNavigate();
   const divRef = useRef<HTMLDivElement>(null);
   const [paragraphCount, setParagraphCount] = useState(0);
   const [formData, setFormData] = useState({
      image: '',
      name: '',
      valor: '',
      memoria: '',
      bateria: '',
      categoria: '',
      condicao: '',
      descricao: ''
   });

   useEffect(() => {
      const updateParagraphCount = () => {
         if (divRef.current) {
            const divWidth = divRef.current.offsetWidth;
            const paragraphWidth = 100;
            setParagraphCount(Math.ceil(divWidth / paragraphWidth));
         }
      };

      updateParagraphCount();

      window.addEventListener('resize', updateParagraphCount);

      return () => {
         window.removeEventListener('resize', updateParagraphCount);
      };
   }, []);

   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   }

   async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      try {
         await axios.post('http://localhost:3333/produto', formData);
         alert('Produto criado com sucesso!');
      } catch (error) {
         console.error('Erro ao criar produto:', error);
      }
   }


   return (
      <div className="catalogo">
         <div className="menu_container">
            <button className="menu_toggle" onClick={() => setOpen(!open)}>
               {open ? '✖' : '☰'}
            </button>
            <div className={`sidebar ${open ? 'open' : ''}`}>
               <button onClick={() => navigate('/Cadastrar_produto')}>
                  <img src={cadastrar_black} alt="Cadastrar Produto" />
                  <span>Cadastrar</span>
               </button>
               <button onClick={() => navigate('/Lista_produtos')}>
                  <img src={lista_black} alt="Lista de Produtos" />
                  <span>Produtos</span>
               </button>
               <button onClick={() => navigate('/configuracoes')}>
                  <img src={configuracao_black} alt="Configurações" />
                  <span>Configurações</span>
               </button>
            </div>
         </div>
         <header>
            <img src={Logo} alt="logo" />
            <div className='text-header'>
               <h2>ALEX IMPORTS</h2>
               <p>FORTAL</p>
            </div>
            <h1>CATÁLOGO</h1>
         </header>
         <div
            className="faixa_div"
            ref={divRef}
            style={{ width: '100%', overflow: 'hidden' }} // Ajuste a altura aqui
         >
            {Array.from({ length: paragraphCount }).map((_, index) => (
               <p key={index} style={{ margin: 0 }}>@alemimporsfortal</p>
            ))}
         </div>

         <main>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
               <div className='text-top'>
                  <button onClick={() => navigate("/configuracoes")}>
                     <p>CONFIGURAÇÃO</p>
                  </button>
               </div>
            </div>
            <div className='Config-geral'>
               <h2>Integrações</h2>
               <form onSubmit={handleSubmit}>
                  <section>
                     <div className="campo_link">
                        <p>Link do catálogo</p>
                        <img src={icon_copy} alt="icon de copiar" />
                     </div>

                     <div className="campo_link">
                        <p>link do whatsapp</p>
                        <img src={icon_copy} alt="icon de copiar" />
                     </div>
                     <div className="campo" style={{ marginTop: 30 }}>
                        <label>Alterar link do Whatsapp:</label>
                        <input type="text" name="whatsapp" placeholder="link do whatsapp" onChange={handleChange} />
                     </div>

                     <div className='btn-cadastrar2' style={{marginTop:20, marginBottom:10}}>
                        <button type="submit">SINCRONIZAR</button>
                     </div>
                     <div className='btn-cadastrar2'>
                        <button type="submit">SALVAR</button>
                     </div>
                  </section>
               </form>
            </div>
         </main>
      </div>
   );
}
