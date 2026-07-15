import { describe, it, expect } from "vitest";
import {
  precoPorUnidade,
  custoItem,
  cmvPrato,
  cmvPercentual,
  semaforo,
  analisarPrato,
  lucroPorCanal,
  pontoEquilibrio,
  type ItemFicha,
} from "./calculos";

describe("precoPorUnidade", () => {
  it("calcula preco por quilo (compra em kg)", () => {
    // 5kg de carne por R$ 50 => R$ 10/kg
    expect(precoPorUnidade(50, 5)).toBe(10);
  });

  it("calcula preco por unidade (cartela de ovos)", () => {
    // 30 ovos por R$ 15 => R$ 0,50/un
    expect(precoPorUnidade(15, 30)).toBe(0.5);
  });

  it("evita divisao por zero", () => {
    expect(precoPorUnidade(50, 0)).toBe(0);
  });
});

describe("custoItem", () => {
  it("gramas: (qtd/1000) * preco_por_unidade", () => {
    // 200g de carne a R$ 10/kg => R$ 2,00
    const item: ItemFicha = {
      ingrediente: { unidade: "g", preco_pago: 50, quantidade: 5 },
      qtd: 200,
    };
    expect(custoItem(item)).toBeCloseTo(2, 5);
  });

  it("unidade: qtd * preco_por_unidade", () => {
    // 3 ovos a R$ 0,50/un => R$ 1,50
    const item: ItemFicha = {
      ingrediente: { unidade: "un", preco_pago: 15, quantidade: 30 },
      qtd: 3,
    };
    expect(custoItem(item)).toBeCloseTo(1.5, 5);
  });
});

describe("cmvPrato", () => {
  it("soma o custo de todos os ingredientes", () => {
    const itens: ItemFicha[] = [
      { ingrediente: { unidade: "g", preco_pago: 50, quantidade: 5 }, qtd: 200 }, // 2,00
      { ingrediente: { unidade: "un", preco_pago: 15, quantidade: 30 }, qtd: 3 }, // 1,50
      { ingrediente: { unidade: "g", preco_pago: 8, quantidade: 1 }, qtd: 50 }, // 0,40
    ];
    expect(cmvPrato(itens)).toBeCloseTo(3.9, 5);
  });

  it("retorna 0 para ficha vazia", () => {
    expect(cmvPrato([])).toBe(0);
  });
});

describe("cmvPercentual", () => {
  it("divide cmv pelo preco de venda", () => {
    expect(cmvPercentual(3, 10)).toBeCloseTo(0.3, 5);
  });
  it("protege contra preco zero", () => {
    expect(cmvPercentual(3, 0)).toBe(0);
  });
});

describe("semaforo (meta 30%)", () => {
  const meta = 0.3;
  it("verde quando cmv% <= meta", () => {
    expect(semaforo(0.3, meta)).toBe("verde");
    expect(semaforo(0.25, meta)).toBe("verde");
  });
  it("amarelo quando meta < cmv% <= meta*1.10", () => {
    expect(semaforo(0.31, meta)).toBe("amarelo");
    expect(semaforo(0.33, meta)).toBe("amarelo"); // 0.30 * 1.10 = 0.33
  });
  it("vermelho quando cmv% > meta*1.10", () => {
    expect(semaforo(0.3301, meta)).toBe("vermelho");
    expect(semaforo(0.5, meta)).toBe("vermelho");
  });
});

describe("analisarPrato", () => {
  it("consolida cmv, percentual, semaforo e margem", () => {
    const itens: ItemFicha[] = [
      { ingrediente: { unidade: "g", preco_pago: 50, quantidade: 5 }, qtd: 200 }, // 2,00
    ];
    const r = analisarPrato(itens, 10, 0.3);
    expect(r.cmv).toBeCloseTo(2, 5);
    expect(r.cmvPercent).toBeCloseTo(0.2, 5);
    expect(r.semaforo).toBe("verde");
    expect(r.margemBruta).toBeCloseTo(8, 5);
  });
});

describe("lucroPorCanal", () => {
  it("desconta a taxa do canal (iFood 27%)", () => {
    // Preço 30, CMV 9, taxa 27% => 30 - 9 - 8,10 = 12,90
    expect(lucroPorCanal(30, 9, 0.27)).toBeCloseTo(12.9, 5);
  });
});

describe("pontoEquilibrio", () => {
  it("faturamento = contas fixas / margem media", () => {
    // R$ 12.000 de contas fixas, margem media 60% => R$ 20.000
    expect(pontoEquilibrio(12000, 0.6)).toBeCloseTo(20000, 5);
  });
  it("retorna Infinity se margem <= 0", () => {
    expect(pontoEquilibrio(12000, 0)).toBe(Infinity);
  });
});
