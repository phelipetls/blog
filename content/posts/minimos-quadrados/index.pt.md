---
title: "Mínimos Quadrados"
date: 2019-03-25
draft: true
---

Esse post um dia chegaria aqui no blog, já que se trata de um dos meus assuntos
favoritos. É bom que me serve para revisar os fundamentos de muito do que vou
usar na monografia. Desde minhas primeiras aulas de Econometria, fiquei
deslumbrado pelo MQO, o Método dos Mínimos Quadrados Ordinários. Eu sempre achei
incrível que é _a ideia correta_, sendo tão intuitiva.

Afinal, a ideia por trás dele é querer minimizar a soma (ou o valor esperado) do
quadrado da diferença entre o parâmetro populacional e nossa estimativa, isto é,
o quanto erramos. Não é exatamente o que poderíamos querer?

Mas, a coisa fica ainda melhor, porque, no avançar dos estudos, os estimadores
que dele surge será revelado como o mais eficiente dentre toda a classe de
estimadores lineares não-viesados (_Best Unbiased Linear Estimator_) pelo
consagrado Teorema de Gauss-Markov: ele o de menor variância, o mais preciso.
Mas somente sob a vigência de alguns pressupostos.

Enfim, agora que deixei claro meu entusiasmo pelo assunto, vou explicar o que
planejo fazer nessa _série de posts_. Neste primeiro, falarei do estimador no
cenário com informação e sem informação, e suas propriedades, de um ponto de
vista mais estatístico. No segundo, falarei da regressão linear simples mais
detidamente, de um ponto de vista mais econométrico (como aprendi). E no
terceiro, do ponto de vista da álgebra linear, a geometria dos mínimos
quadrados.

Cada uma delas contribui para um entendimento melhor do assunto de um jeito
próprio, mas merece destaque esta última, porque é o único jeito de pensar a
regressão múltipla, que é o que importa.

Além disso, irei enfatizar como se demonstra as propriedades desejáveis dos
estimadores de MQO em todas elas e as sutilezas que acho mais importantes de se
ter em mente.

#####
