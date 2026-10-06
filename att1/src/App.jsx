import { useState, useEffect } from 'react';

const PRODUTOS_INICIAIS = [
  {
    id: 1,
    nome: 'Fone de Ouvido Bluetooth',
    preco: 299.90,
    categoria: 'Eletrônicos',
    descricao: 'Fone com cancelamento de ruído ativo e autonomia de 30 horas.',
    avaliacao: 4.8
  },
  {
    id: 2,
    nome: 'Teclado Mecânico RGB',
    preco: 450.00,
    categoria: 'Periféricos',
    descricao: 'Teclado mecânico switch blue com iluminação RGB customizável.',
    avaliacao: 4.9
  },
  {
    id: 3,
    nome: 'Monitor UltraWide 29"',
    preco: 1250.00,
    categoria: 'Monitores',
    descricao: 'Resolução Full HD, IPS, 75Hz com suporte a HDR.',
    avaliacao: 4.7
  },
  {
    id: 4,
    nome: 'Mouse Sem Fio Ergonômico',
    preco: 180.50,
    categoria: 'Periféricos',
    descricao: 'Design ergonômico reduz a fadiga muscular durante o uso prolongado.',
    avaliacao: 4.5
  }
];

export default function App() {
  const [produtos, setProdutos] = useState(() => {
    const salvos = localStorage.getItem('catalogo_produtos');
    return salvos ? JSON.parse(salvos) : PRODUTOS_INICIAIS;
  });

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  
  // Estado para controlar a exibição do formulário
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Eletrônicos');
  const [novaDescricao, setNovaDescricao] = useState('');

  useEffect(() => {
    localStorage.setItem('catalogo_produtos', JSON.stringify(produtos));
  }, [produtos]);

  const categorias = ['Todas', ...new Set(produtos.map(p => p.categoria))];

  const adicionarProduto = (e) => {
    e.preventDefault();
    if (!novoNome || !novoPreco || !novaDescricao) return;

    const novoItem = {
      id: Date.now(),
      nome: novoNome,
      preco: parseFloat(novoPreco),
      categoria: novaCategoria,
      descricao: novaDescricao,
      avaliacao: 5.0
    };

    setProdutos([novoItem, ...produtos]);
    setNovoNome('');
    setNovoPreco('');
    setNovaDescricao('');
    setMostrarFormulario(false); // Esconde o formulário após cadastrar
  };

  const removerProduto = (id) => {
    setProdutos(produtos.filter(p => p.id !== id));
  };

  const produtosFiltrados = produtos.filter(produto => {
    const atendeBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) || 
                        produto.descricao.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria = categoriaFiltro === 'Todas' || produto.categoria === categoriaFiltro;
    return atendeBusca && atendeCategoria;
  });

  return (
    <div>
      <header>
        <div className="header-container">
          <div className="brand">
            <h1>TechStore Catalog</h1>
          </div>
          <span className="badge-count">
            {produtos.length} {produtos.length === 1 ? 'Produto' : 'Produtos'}
          </span>
        </div>
      </header>

      <main>
        <aside>
          <div className="card-form">
            <button 
              type="button" 
              className="btn-toggle-form"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              <span>{mostrarFormulario ? '- Fechar Formulário' : '+ Novo Produto'}</span>
            </button>

            {mostrarFormulario && (
              <form onSubmit={adicionarProduto} className="form-content">
                <div className="form-group">
                  <label>Nome do Produto</label>
                  <input 
                    type="text" 
                    required
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    placeholder="Ex: Mouse Gamer"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(e.target.value)}
                    placeholder="0.00"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    className="form-control"
                  >
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Periféricos">Periféricos</option>
                    <option value="Monitores">Monitores</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea 
                    required
                    rows="3"
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    placeholder="Detalhes sobre o produto..."
                    className="form-control"
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Cadastrar Produto
                </button>
              </form>
            )}
          </div>
        </aside>

        <section>
          <div className="filter-bar">
            <input 
              type="text" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produtos..."
              className="form-control search-input"
            />

            <select 
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="form-control select-filter"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {produtosFiltrados.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar seus filtros de busca.</p>
            </div>
          ) : (
            <div className="products-grid">
              {produtosFiltrados.map((produto) => (
                <div key={produto.id} className="product-card">
                  <div>
                    <div className="card-header-info">
                      <span className="tag-category">🏷️ {produto.categoria}</span>
                      <div className="rating">⭐ {produto.avaliacao}</div>
                    </div>

                    <h3 className="product-title">{produto.nome}</h3>
                    <p className="product-description">{produto.descricao}</p>
                  </div>

                  <div className="card-footer">
                    <div>
                      <span className="price-label">Preço</span>
                      <span className="price-value">
                        R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button 
                      onClick={() => removerProduto(produto.id)}
                      className="btn-delete"
                      title="Excluir produto"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}