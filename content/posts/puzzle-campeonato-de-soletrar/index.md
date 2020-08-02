---
title: "Puzzle do Campeonato de Soletrar"
date: 2019-04-15
layout: post
categories: ["Programming", "R", "Statistics"]
tags: ["puzzle"]
aliases: ["/puzzle-campeonato-de-soletrar"]
math: true
draft: true
---

Procurando por puzzles probabilísticos na seção [The
Riddler](https://fivethirtyeight.com/tag/the-riddler/) do
FiveThirtyEight, encontrei um bastante intrigante, que pedia mais ou
menos o seguinte:

> Imagine que você está numa competição de soletrar com outros 8
> participantes. Você memorizou 99% do dicionário e cada um dos outros
> oito memorizou 1% a menos que você (de 98% até 90%). Em uma ordem
> fixa, os competidores soletram uma palavra por turno. Se errar, está
> fora: o último que sobrar vence. Qual a probabilidade de você ganhar,
> dado que estão em ordem crescente de conhecimento (você por último)? E
> a probabilidade em uma ordem decrescente (você primeiro)? As palavras
> são sorteadas aleatoriamente do dicionário. Qualquer palavra não
> memorizada *será* incorretamente soletrada. Cada turno é independente
> um do outro.

A intuição nos diz que você é o mais provável a vencer, mas quão mais?
Deduz-se também que, se você é o último da fila, essa probabilidade
aumenta, porque os outros podem errar antes que você erre. Ao passo que,
se você for o primeiro, ela diminui porque você pode se deparar com uma
palavra que desconhece antes dos outros errarem. O objetivo é calcular
as probabilidades em ambos os casos.

Para isso, vamos antes esclarecer o que precisamente queremos calcular,
as condições sob as quais você vencerá:

1.  No caso de ser o último, supondo N palavras sorteadas, você só
    precisa ter acertado N-1 delas, se seus oponentes já tiverem errado
    ao menos uma.

2.  Já no caso em que você é o primeiro, você terá que acertar N
    palavras, e seus oponentes terão que errar alguma delas logo após.

Então, queremos calcular a probabilidade de você ter acertado N-1 (ou N)
palavras consecutivamente E de seus oponentes terem errado ao menos uma
delas.

A maneira mais compreensível para fazer isso é usando a teoria da
probabilidade. É fácil perceber que soletrar certo ou errado a palavra é
uma variável aleatória de Bernoulli, com parâmetro p, a probabilidade de
sucesso, sendo a probabilidade de soletrar corretamente. Sabendo disso,
há muitas distribuições que pressupõem repetições independentes de um
ensaio de Bernoulli que modelam muito bem as situações que descrevemos.

# Distribuição geométrica: a probabilidade de N acertos até o primeiro erro

O número de acertos até o primeiro erro pode ser modelado como uma
variável aleatória discreta, com domínio \\( \[0, \infty\] \\)
(teoricamente), que tem distribuição geométrica com parâmetro p, a
probabilidade de sucesso, \\( X \sim Geom(p) \\).

A função de probabilidade dessa distribuição nos dá a probabilidade de x
*fracassos* até o primeiro sucesso. Assumindo independência, aplicamos a
regra da multiplicação para chegar a

$$
P_X(X = x) = (1 - p)^xp
$$

Mas, note que, na verdade, no *nosso* caso, estamos interessados no
número de acertos (sucessos) até o primeiro erro (fracasso). É, não vai
demorar para você perceber que isso é arbitrário. Basta usarmos \\( 1-p \\)
como o parâmetro, ao invés de p, para chegarmos ao que queremos:

$$
P_X(X = x) = p^x(1-p)
$$

# Distribuição binomial: a probabilidade de erro de seus oponentes

Já a probabilidade de seus oponentes errarem ao menos uma das N
perguntas é simplesmente a probabilidade complementar deles terem
acertado TODAS as N perguntas, i.e. \\( 1 - p^N \\).

Eessa v.a. pode assumir qualquer valor possível de perguntas sorteadas,
\\( Im(Y) = \[1, \infty\] \\), e tem distribuição binomial com parâmetro \\( N \\)
e \\( p \\). Para relembrar, essa distribuição serve para modelar o número de
sucessos em \\( N \\) ensaios de Bernoulli independentes. No nosso caso,
queremos 1 menos a probabilidade do competidor ter acertado todas as \\( N \\)
perguntas:

$$
P_X(X = x) = {N\choose N} p^{N}(1-p)^{N-N} = 1 \cdot p^N \cdot (1-p)^0 = p^N \\ P(\text{Errou alguma}) = 1 - p^N
$$

# A probabilidade de você vencer

Para chegar à resposta no

1.  caso de ser o último, vamos multiplicar a probabilidade de você ter
    acertado consecutivamente N-1 perguntas até errar com o produto das
    probabilidades dos outros terem errado ao menos uma das N perguntas;
    e no

2.  caso de você ser o primeiro, o mesmo só que agora com a
    probabilidade de você ter acertado N perguntas.

Vamos aos cálculos então, vamos primeiro criar um vetor pras
probabilidades e outro pro número de perguntas

``` r
N <- 1:10000 # vetor p/ numero de perguntas
probs <- seq(.98, .9, -.01) # vetor p/ probs
```

Em seguida, o cálculo da probabilidade de você acertar tantas perguntas
até errar.

``` r
library(magrittr)

# comecemos com o primeiro caso
geom <- dgeom(
  x = N - 1,
  prob = 1 - .99
)
```

Agora, precisamos das probabilidade dos outros falharem. Para isso, vou
criar uma matriz em que cada linha representa um competidor e cada
coluna um número de pergunta, para depois povoá-la com as probabilidades

``` r
A <- matrix(nrow = 8, ncol = 10000)


for (i in 1:dim(A)[1]) {
  for (j in 1:dim(A)[2]) {

    # prob. de cada competidor
    # ter acertado todas as j perguntas
    # com probabilidade de acerto probs[i]

    A[i, j] <- 1 - dbinom(
      x = j,
      size = j,
      prob = probs[i]
    )
  }
}

A[1:8, 1:5]
```

    ##      [,1]   [,2]     [,3]       [,4]      [,5]
    ## [1,] 0.02 0.0396 0.058808 0.07763184 0.0960792
    ## [2,] 0.03 0.0591 0.087327 0.11470719 0.1412660
    ## [3,] 0.04 0.0784 0.115264 0.15065344 0.1846273
    ## [4,] 0.05 0.0975 0.142625 0.18549375 0.2262191
    ## [5,] 0.06 0.1164 0.169416 0.21925104 0.2660960
    ## [6,] 0.07 0.1351 0.195643 0.25194799 0.3043116
    ## [7,] 0.08 0.1536 0.221312 0.28360704 0.3409185
    ## [8,] 0.09 0.1719 0.246429 0.31425039 0.3759679

Para a resposta final, temos que ter o produto para cada coluna dessa
matriz. Vamos usar a função `apply()`, que aplica uma função ao longe de
uma dimensão de uma array.

``` r
produtos <- apply(A,
  MARGIN = 2,
  FUN = prod
)
```

Agora resta multiplicar esse vetor com o previamente calculado para
chegar a resposta final:

``` r
(produtos * geom) %>% sum()
```

    ## [1] 0.5259606

Já no caso em que você soletra primeiro:

``` r
geom <- dgeom(
  x = N,
  prob = 1 - .99
)

(produtos * geom) %>% sum()
```

    ## [1] 0.5207009

# Conclusões
