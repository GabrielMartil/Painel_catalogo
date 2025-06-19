import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cadastrar_produto.css';

import Logo from '../../img/logoaleximports.png'
import axios from 'axios';

import cadastrar_black from "../../img/cadastrar_black.png";
import lista_black from "../../img/lista_black.png";
import configuracao_black from "../../img/configuracao_black.png";

export default function Cadastrar_produto() {

  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setSubmitted(true);
    const { name, valor, memoria } = formData;
    try {
      if (!name || !valor || !memoria) {
        alert("Preencha os campos Nome, Valor e Memória");
        return;
      }

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
              <label>
                Produto:
                {!formData.name && <span style={{ color: 'red' }}> *</span>}
              </label>
              <input type="text" name="name" placeholder="Nome do Produto"
                onChange={handleChange}
                style={{
                  borderColor: submitted && !formData.name ? 'red' : undefined,
                }}
              />
            </div>
            <div className="campo">
              <label>
                Valor:
                {!formData.valor && <span style={{ color: 'red' }}> *</span>}
              </label>
              <input
                type="text"
                name="valor"
                placeholder="Valor"
                onChange={handleChange}
                style={{
                  borderColor: submitted && !formData.valor ? 'red' : undefined,
                }}
              />
            </div>
            <div className="campo" style={{ display: "flex" }}>
              <label>
                Memória:
                {!formData.memoria && <span style={{ color: 'red' }}> *</span>}
              </label>
              <input
                type="text"
                name="memoria"
                placeholder="Memória"
                onChange={handleChange}
                value={formData.memoria || ''}
                style={{
                  borderColor: submitted && !formData.memoria ? 'red' : undefined,
                }}
              />
            </div>
            <div className="campo2" style={{ marginTop: 20, alignItems: "center" }}>
              <label><strong>Condição:</strong></label>
              <div style={{ display: 'flex', margin: 10, gap: 10 }}>
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
              <label style={{ marginBottom: 2 }}>Categoria:</label>
              <select name="categoria" onChange={handleChange}>
                <option value="">Selecione uma categoria</option>
                <option value="Iphone">Iphone</option>
                <option value="IPad">IPad</option>
                <option value="Macbook">Macbook</option>
                <option value="applewatch">Apple Watch</option>
              </select>
            </div>
            <div className="campo">
              <label style={{ marginBottom: 2 }}>Descrição:</label>
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
