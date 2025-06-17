import { useState, useRef, useEffect } from 'react';
import './Configuracao.css';

import Logo from '../../img/logoaleximports.png'
import Whatsapp_logo from '../../img/WhatsApp.png';
import instagram_logo from '../../img/Instagram.png';

import cadastrar_black from "../../img/cadastrar_black.png";
import lista_black from "../../img/lista_black.png";
import configuracao_black from "../../img/configuracao_black.png";
import { useNavigate } from 'react-router-dom';

import icon_copy from "../../img/Copy.png";
import axios from 'axios';

export default function Configuracao() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [paragraphCount, setParagraphCount] = useState(0);

  const [instagramOn, setInstagramOn] = useState(true);
  const [whatsappOn, setWhatsappOn] = useState(false);

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

     const link = "https://aleximportscatalogo.vercel.app/";

   const copiarLink = () => {
      navigator.clipboard.writeText(link)
         .then(() => {
            alert("Link copiado com sucesso!");
         })
         .catch(() => {
            alert("Erro ao copiar o link.");
         });
   };

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
            <button>
              <p>CONFIGURAÇÃO</p>
            </button>
          </div>
        </div>
        <div className='Config-geral'>
          <h2>Informações da Loja</h2>
          <p>nome da loja</p>
          <p>nome do instagram</p>
          <p>numero do whatsapp/telefone</p>

          <div className="campo_link" style={{ cursor: 'pointer',marginTop:30 }} onClick={copiarLink}>
            <p>Link do catálogo</p>
            <img src={icon_copy} alt="icon de copiar" />
          </div>

          <form onSubmit={handleSubmit}>
            <section>
              <div className="campo">
                <label>Nome:</label>
                <input type="text" name="name" placeholder="nome da loja" onChange={handleChange} />
              </div>
              <div className="campo">
                <label>Numero:</label>
                <input type="text" name="whatsapp" placeholder="Numero do whatsapp" onChange={handleChange} />
              </div>
              <div className="campo">
                <label>Instagram:</label>
                <input type="text" name="instagram" placeholder="instagram da loja" onChange={handleChange} />
              </div>

              <div className="container-icon">
                <div className="icon-toggle">
                  <img className="icon" src={instagram_logo} alt='logo do instagram' />
                  <div className="switch" onClick={() => setInstagramOn(!instagramOn)}>
                    <div className={`slider ${instagramOn ? 'on' : 'off'}`}>
                      <span className="label">{instagramOn ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </div>

                <div className="icon-toggle">
                  <img className="icon" src={Whatsapp_logo} alt='logo do whatsapp' />
                  <div className="switch" onClick={() => setWhatsappOn(!whatsappOn)}>
                    <div className={`slider ${whatsappOn ? 'on' : 'off'}`}>
                      <span className="label">{whatsappOn ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='btn-cadastrar' style={{marginBottom:100}}>
                <button type="submit">SALVAR</button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}
