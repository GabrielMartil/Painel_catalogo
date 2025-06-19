import { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Lista_produtos.css';

import Logo from '../../img/logoaleximports.png'
import produto_sem_foto from '../../img/sem-foto.png';

import cadastrar_black from "../../img/cadastrar_black.png";
import lista_black from "../../img/lista_black.png";
import configuracao_black from "../../img/configuracao_black.png";
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface ProdutosProps {
  id: string,
  image: string,
  name: string,
  valor: string,
  memoria: string,
  bateria: string,
  categoria: string,
  condicao: string,
  descricao: string
};

export default function Lista_produtos() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const divRef = useRef<HTMLDivElement>(null);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [produtos, setProdutos] = useState<ProdutosProps[]>([]);

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

  useEffect(() => {
    loadProdutos();
  }, [])

  async function loadProdutos() {
    try {

      const response = await api.get('https://api-catalogo-7z6l.onrender.com/produtos');
      //const response = await api.get('http://localhost:3333/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }


  async function handleCancelar(id: string) {
    try {
      await api.delete(`https://api-catalogo-7z6l.onrender.com/produtodelete/${id}`);
      //await api.delete(`http://localhost:3333/produtodelete/${id}`);
      loadProdutos();
    } catch (error) {
      console.error('Erro ao apagar produto:', error);
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
        style={{ width: '100%', overflow: 'hidden' }}
      >
        {Array.from({ length: paragraphCount }).map((_, index) => (
          <p key={index} style={{ margin: 0 }}>@alemimporsfortal</p>
        ))}
      </div>

      <main>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 50, fontFamily: "lora" }}>
          <h2>Lista de produtos</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 100 }}>
          {produtos.length === 0 ? (
            <p style={{ color: '#eb0000' }}>Nenhum produto cadastrado ainda.</p>
          ) : (
            produtos.map((produto) => {
              const isImagemValida = produto.image && produto.image.length > "data:image/jpeg;base64,".length;

              return (
                <div key={produto.id} className='list-div'>
                  <div className='list-div-2'>
                    <img
                      src={
                        isImagemValida
                          ? (produto.image.startsWith("data:image")
                            ? produto.image
                            : `data:image/jpeg;base64,${produto.image}`)
                          : produto_sem_foto
                      }
                      alt={produto.name}
                      className="produto-imagem"
                      style={{ maxWidth: 140 }}
                    />

                    <div className='list-infor'>
                      <div>
                        <p><strong>Nome do Produto: </strong>{produto.name}</p>
                      </div>
                      <div>
                        <p><strong>Categoria: </strong>{produto.categoria}</p>
                      </div>
                      <div>
                        <p><strong>Condição: </strong>{produto.condicao}</p>
                      </div>
                      <div>
                        <p><strong>Memória: </strong>{produto.memoria}GB</p>
                      </div>
                      <div>
                        <p><strong>Valor: </strong>R$ {produto.valor}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <button
                      onClick={() => navigate(`/Editar_produto/${produto.id}`)}
                      className='btn-list-edit'
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleCancelar(produto.id)}
                      className='btn-list-trash'
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>


    </div>
  );
}
