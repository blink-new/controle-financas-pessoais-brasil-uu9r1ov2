import { blink } from '../blink/client';
import { Transaction, Category } from '../types';
import { mockDataService } from './mockData';

export interface ExtractedTransaction {
  description: string;
  amount: number;
  date: string;
  category?: string;
  confidence: number;
}

export interface ImportResult {
  success: boolean;
  processedTransactions: number;
  errors: string[];
  transactions: Transaction[];
}

// Serviço de IA para categorização inteligente
export const aiService = {
  // Extrai texto de PDF usando OCR
  extractTextFromPDF: async (file: File): Promise<string> => {
    try {
      const extractedText = await blink.data.extractFromBlob(file);
      return extractedText;
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
      throw new Error('Erro ao processar PDF');
    }
  },

  // Processa extratos bancários com IA
  parseFinancialStatement: async (text: string): Promise<ExtractedTransaction[]> => {
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Analise este extrato bancário e extraia as transações. 
        
        Texto do extrato:
        ${text}
        
        Para cada transação, identifique:
        1. Descrição (nome do estabelecimento/pessoa)
        2. Valor (positivo para crédito/entrada, negativo para débito/saída)
        3. Data (formato YYYY-MM-DD)
        4. Categoria sugerida baseada na descrição
        5. Nível de confiança (0-100)
        
        Ignore linhas que não sejam transações (saldos, cabeçalhos, etc.)
        
        Categorias disponíveis:
        - Alimentação (supermercados, restaurantes, delivery)
        - Transporte (combustível, Uber, pedágios)
        - Moradia (aluguel, condomínio, água, luz)
        - Saúde (farmácias, consultas, exames)
        - Educação (cursos, livros, mensalidades)
        - Lazer (cinema, streaming, jogos)
        - Compras (roupas, eletrônicos, varejo)
        - Assinaturas (Netflix, Spotify, software)
        - Salário (pagamentos de trabalho)
        - Freelance (trabalhos extras)
        - Investimentos (aplicações, resgates)
        - Transferência (TED, DOC, PIX)`,
        
        schema: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string' },
                  amount: { type: 'number' },
                  date: { type: 'string' },
                  category: { type: 'string' },
                  confidence: { type: 'number' }
                },
                required: ['description', 'amount', 'date', 'confidence']
              }
            }
          },
          required: ['transactions']
        }
      });

      return object.transactions || [];
    } catch (error) {
      console.error('Erro ao processar extrato com IA:', error);
      throw new Error('Erro ao analisar extrato');
    }
  },

  // Categoriza uma transação individual
  categorizeTransaction: async (description: string): Promise<{ category: string; confidence: number }> => {
    try {
      const categories = await mockDataService.getCategories();
      const categoryNames = categories.map(c => c.name).join(', ');
      
      const { object } = await blink.ai.generateObject({
        prompt: `Categorize esta transação financeira: "${description}"
        
        Categorias disponíveis: ${categoryNames}
        
        Baseie-se no nome do estabelecimento ou descrição para sugerir a categoria mais apropriada.
        
        Exemplos:
        - "Supermercado Pão de Açúcar" → Alimentação
        - "Posto Shell" → Transporte
        - "Netflix" → Lazer
        - "Uber" → Transporte
        - "Farmácia Drogasil" → Saúde
        - "Salário Janeiro" → Salário
        - "PIX Recebido" → Transferência
        
        Retorne o nome exato da categoria e um nível de confiança (0-100).`,
        
        schema: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            confidence: { type: 'number' }
          },
          required: ['category', 'confidence']
        }
      });

      return {
        category: object.category || 'Sem categoria',
        confidence: object.confidence || 0
      };
    } catch (error) {
      console.error('Erro ao categorizar transação:', error);
      return { category: 'Sem categoria', confidence: 0 };
    }
  },

  // Processa arquivo completo (PDF, CSV, OFX)
  processFinancialFile: async (file: File, accountId: string): Promise<ImportResult> => {
    try {
      const result: ImportResult = {
        success: false,
        processedTransactions: 0,
        errors: [],
        transactions: []
      };

      let extractedText = '';
      
      // Extrai texto baseado no tipo de arquivo
      if (file.type === 'application/pdf') {
        extractedText = await aiService.extractTextFromPDF(file);
      } else if (file.type === 'text/csv') {
        extractedText = await file.text();
      } else if (file.name.endsWith('.ofx')) {
        extractedText = await file.text();
      } else {
        throw new Error('Tipo de arquivo não suportado');
      }

      // Analisa o texto com IA
      const extractedTransactions = await aiService.parseFinancialStatement(extractedText);
      
      // Converte para transações do sistema
      const categories = await mockDataService.getCategories();
      
      for (const extracted of extractedTransactions) {
        try {
          // Encontra a categoria correspondente
          const category = categories.find(c => 
            c.name.toLowerCase() === extracted.category?.toLowerCase()
          );
          
          // Determina o tipo da transação
          let transactionType: Transaction['type'] = 'expense';
          if (extracted.amount > 0) {
            if (category?.type === 'income') {
              transactionType = 'income';
            } else if (category?.type === 'investment') {
              transactionType = 'investment';
            } else if (category?.type === 'transfer') {
              transactionType = 'transfer';
            }
          }
          
          // Cria a transação
          const transaction = await mockDataService.createTransaction({
            accountId,
            categoryId: category?.id,
            description: extracted.description,
            amount: extracted.amount,
            transactionDate: extracted.date,
            type: transactionType,
            installmentNumber: 1,
            totalInstallments: 1,
            userId: 'user_1',
            notes: `Importado automaticamente (confiança: ${extracted.confidence}%)`,
            isPending: extracted.confidence < 70 // Marca como pendente se confiança baixa
          });
          
          result.transactions.push(transaction);
          result.processedTransactions++;
        } catch (error) {
          result.errors.push(`Erro ao processar transação: ${extracted.description}`);
        }
      }
      
      result.success = result.processedTransactions > 0;
      return result;
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      return {
        success: false,
        processedTransactions: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
        transactions: []
      };
    }
  },

  // Gera insights financeiros
  generateFinancialInsights: async (transactions: Transaction[]): Promise<string[]> => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyTransactions = transactions.filter(t => 
        t.transactionDate.startsWith(currentMonth)
      );
      
      const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const expensesByCategory = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          const category = t.category?.name || 'Sem categoria';
          acc[category] = (acc[category] || 0) + Math.abs(t.amount);
          return acc;
        }, {} as Record<string, number>);
      
      const topCategory = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)[0];
      
      const transactionSummary = {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        topCategory: topCategory ? topCategory[0] : 'Nenhuma',
        topCategoryAmount: topCategory ? topCategory[1] : 0,
        transactionCount: monthlyTransactions.length
      };
      
      const { object } = await blink.ai.generateObject({
        prompt: `Analise estes dados financeiros e gere insights úteis:
        
        Receitas: R$ ${totalIncome.toFixed(2)}
        Despesas: R$ ${totalExpenses.toFixed(2)}
        Saldo: R$ ${(totalIncome - totalExpenses).toFixed(2)}
        Principal categoria de gastos: ${transactionSummary.topCategory} (R$ ${transactionSummary.topCategoryAmount.toFixed(2)})
        Total de transações: ${transactionSummary.transactionCount}
        
        Gere entre 3-5 insights práticos e acionáveis, como:
        - Alertas sobre gastos excessivos
        - Sugestões de economia
        - Padrões de comportamento financeiro
        - Recomendações de investimento
        - Dicas de otimização
        
        Seja específico e prático, focando em ações que a pessoa pode tomar.`,
        
        schema: {
          type: 'object',
          properties: {
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  suggestion: { type: 'string' },
                  priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                },
                required: ['title', 'description', 'suggestion', 'priority']
              }
            }
          },
          required: ['insights']
        }
      });

      return object.insights?.map(insight => 
        `${insight.title}: ${insight.description} ${insight.suggestion}`
      ) || [];
      
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      return ['Erro ao gerar insights financeiros'];
    }
  },

  // Busca informações sobre estabelecimentos
  searchEstablishmentInfo: async (establishmentName: string): Promise<{ category: string; info: string }> => {
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Pesquise informações sobre este estabelecimento: "${establishmentName}"
        
        Determine:
        1. Que tipo de estabelecimento é (categoria de negócio)
        2. Informações úteis (horário, localização, especialidades)
        
        Seja específico e útil para ajudar o usuário a entender melhor seus gastos.`,
        
        schema: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            info: { type: 'string' }
          },
          required: ['category', 'info']
        }
      });

      return {
        category: object.category || 'Desconhecido',
        info: object.info || 'Informações não disponíveis'
      };
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
      return {
        category: 'Desconhecido',
        info: 'Informações não disponíveis'
      };
    }
  }
};