import { useState, useRef, useEffect } from 'react';
import './Configuracao.css';

import Logo from '../../img/logoaleximports.png';
import Whatsapp_logo from '../../img/WhatsApp.png';
import instagram_logo from '../../img/Instagram.png';

import cadastrar_black from "../../img/cadastrar_black.png";
import lista_black from "../../img/lista_black.png";
import configuracao_black from "../../img/configuracao_black.png";
import { useNavigate } from 'react-router-dom';

import icon_copy from "../../img/Copy.png";
import axios from 'axios';

interface ConfiguracaoProps {
  id: string,
  name_loja: string,
  instagram_name: string,
  whatsapp_num: string,
};

export default function Configuracao() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [whatsappOn, setWhatsappOn] = useState(true);
  const [instagramOn, setInstagramOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoProps[]>([]);

  const [formData, setFormData] = useState({
    name_loja: '',
    whatsapp_num: '',
    instagram_name: ''
  });

  // Carregar configuração do backend ao montar
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
    return () => window.removeEventListener('resize', updateParagraphCount);
  }, []);

  // Buscar configuração
  useEffect(() => {
    loadConfiguracao();
  }, [])

  async function loadConfiguracao() {
    try {
      const response = await axios.get('https://api-catalogo-7z6l.onrender.com/configuracaos');
      //const response = await axios.get('http://localhost:3333/configuracaos');
      setConfiguracao(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('https://api-catalogo-7z6l.onrender.com/configuracao', {
      //await axios.put('http://localhost:3333/configuracao', {
        name_loja: formData.name_loja,
        whatsapp_num: formData.whatsapp_num,
        instagram_name: formData.instagram_name,
        whatsapp_status: whatsappOn ? "on" : "off",
        instagram_status: instagramOn ? "on" : "off",
      });
      alert('Configuração salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      alert('Erro ao salvar configuração.');
    } finally {
      setLoading(false);
    }
  }

  const link = "https://aleximportscatalogo.vercel.app/";

  const copiarLink = () => {
    navigator.clipboard.writeText(link)
      .then(() => alert("Link copiado com sucesso!"))
      .catch(() => alert("Erro ao copiar o link."));
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

      <div className="faixa_div" ref={divRef} style={{ width: '100%', overflow: 'hidden' }}>
        {Array.from({ length: paragraphCount }).map((_, index) => (
          <p key={index} style={{ margin: 0 }}>@aleximportsfortal</p>
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
          <p>{configuracao[0]?.name_loja}</p>
          <p>{configuracao[0]?.instagram_name}</p>
          <p>{configuracao[0]?.whatsapp_num}</p>

          <div className="campo_link" style={{ cursor: 'pointer', marginTop: 30 }} onClick={copiarLink}>
            <p>Link do catálogo</p>
            <img src={icon_copy} alt="icon de copiar" />
          </div>

          <form onSubmit={handleSubmit}>
            <section>
              <div className="campo_config">
                <label>Nome da Loja:</label>
                <input
                  type="text"
                  name="name_loja"
                  placeholder="Nome da loja"
                  onChange={handleChange}
                  value={formData.name_loja}
                />
              </div>
              <div className="campo_config">
                <label>Whatsapp:</label>
                <input
                  type="text"
                  name="whatsapp_num"
                  placeholder="Número do WhatsApp"
                  onChange={handleChange}
                  value={formData.whatsapp_num}
                />
              </div>
              <div className="campo_config">
                <label>Instagram:</label>
                <input
                  type="text"
                  name="instagram_name"
                  placeholder="@instagram"
                  onChange={handleChange}
                  value={formData.instagram_name}
                />
              </div>

              <div className="container-icon">
                <div className="icon-toggle">
                  <img className="icon" src={Whatsapp_logo} alt="WhatsApp logo" />
                  <div className="switch" onClick={() => setWhatsappOn(!whatsappOn)}>
                    <div className={`slider ${whatsappOn ? "on" : "off"}`}>
                      <span className="label">{loading ? "..." : whatsappOn ? "ON" : "OFF"}</span>
                    </div>
                  </div>
                </div>

                <div className="icon-toggle">
                  <img className="icon" src={instagram_logo} alt="Instagram logo" />
                  <div className="switch" onClick={() => setInstagramOn(!instagramOn)}>
                    <div className={`slider ${instagramOn ? "on" : "off"}`}>
                      <span className="label">{loading ? "..." : instagramOn ? "ON" : "OFF"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='btn-cadastrar' style={{ marginBottom: 100 }}>
                <button type="submit" disabled={loading}>
                  {loading ? "SALVANDO..." : "SALVAR"}
                </button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}
