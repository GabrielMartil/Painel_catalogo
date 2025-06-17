import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastrar_produto.css';

import Logo from '../../img/logoaleximports.png'
import axios from 'axios';

import cadastrar_black from "../../img/cadastrar_black.png";
import lista_black from "../../img/lista_black.png";
import configuracao_black from "../../img/configuracao_black.png";

/*interface ProdutosProps {
  id: string,
  image: string,
  name: string,
  valor: string,
  memoria: string,
  bateria: string,
  categoria: string,
  condicao: string,
  descricao: string
};*/

export default function Cadastrar_produto() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
        const paragraphWidth = 100; // Largura aproximada de cada <p>
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post('https://api-catalogo-7z6l.onrender.com/produto', formData);
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
        <form onSubmit={handleSubmit}>
          <section>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="imagem-upload">
                <label htmlFor="upload">
                  <div className="imagem-placeholder">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Imagem de produto" className="imagem-preview" />
                    ) : (
                      <span role="img" aria-label="upload">🖼️⬆️</span>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="campo">
              <label>Produto:</label>
              <input type="text" name="name" placeholder="Nome do Produto" onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Valor:</label>
              <input type="text" name="valor" placeholder="Valor" onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Memória:</label>
              <input type="text" name="memoria" placeholder="Memória" onChange={handleChange} />
            </div>
                <div className="campo2" style={{ marginTop: 20, alignItems: "center" }}>
                  <label><strong>Condição:</strong></label>
                  <div style={{ display: 'flex', margin: 10, gap:10 }}>
                    {['Novos', 'Seminovos'].map((opcao) => (
                      <label key={opcao}>
                        <input
                          type="radio"
                          name="condicao"
                          value={opcao}
                          checked={formData.condicao === opcao}
                          onChange={handleChange}
                        />
                        <span style={{ fontWeight: 'bold' }}>{opcao}</span>
                      </label>
                    ))}
                  </div>
                </div>
            <div className="campo">
              <label>
                Bateria:
                {formData.condicao === "Seminovos" && <span style={{ color: 'red' }}> *</span>}
              </label>
              <input
                type="text"
                name="bateria"
                placeholder="Bateria"
                onChange={handleChange}
                style={{
                  borderColor:
                    formData.condicao === "Seminovos" && !formData.bateria
                      ? 'red'
                      : undefined
                }}
              />
            </div>
            <div className="campo">
              <label>Categoria:</label>
              <input type="text" name="categoria" placeholder="Categoria" onChange={handleChange} />
            </div>
            <div className="campo">
              <label>Descrição:</label>
              <input type="text" name="descricao" placeholder="Descrição" onChange={handleChange} />
            </div>
            <div className='btn-cadastrar'>
              <button type="submit">CADASTRAR</button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
