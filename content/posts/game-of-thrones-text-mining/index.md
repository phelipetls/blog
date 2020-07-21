---
layout: post
title: "Mineração de Texto com as legendas de Game of Thrones"
date: 2019-04-20
tags: ["tidyverse", "dataviz", "ggplot2", "tidytext", "r"]
comments: true
---

Nesse post vou combinar duas das minhas coisas favoritas: R e Game of
Thrones. Difícil ficar melhor que isso. Juntando a euforia causada pela
volta da série com o meu interesse em análise de dados com o tidyverse,
tive a ideia de fazer mineração de texto com base nas legendas de GOT.

Essa tarefa é muito facilitada pelo pacote [`tidytext`](https://www.tidytextmining.com),
que generaliza a ideia de um tidy dataset para dados compostos de puro texto,
como um livro ou legendas.

Como veremos, isso facilitará muito a análise e criação de
visualizações.

##### Obtendo os dados

Os dados brutos foram coletados
[aqui](https://www.kaggle.com/gunnvant/game-of-thrones-srt), onde os encontrei
em formato JSON. São 7 arquivos, que contêm todas as legendas para as
sete temporadas de GOT. Felizmente, há uma biblioteca para ler arquivos
JSON no R, o `jsonlite`.

No código abaixo, o que fiz foi ler cada arquivo, aplicando a função
`jsonlite::fromJSON()` a cada um deles com `purrr::map()`, o que me dá uma
lista. Depois, transformei essa lista em um vetor com `unlist()`, que por fim
transformei em um data.frame com `tibble::enframe()`.

``` r
library(jsonlite)
library(tidyverse)

setwd("~/got_subtitles/")

# vetor com o endereço dos arquivos
arquivos <- dir(path = getwd(), pattern = "json$", full.names = T)

# lendo os arquivos
got_subs_raw <- map(arquivos, ~ fromJSON(.x)) %>%
  unlist() %>%
  enframe()

got_subs_raw
```

    ## # A tibble: 44,890 x 2
    ##    name                             value
    ##    <chr>                            <chr>
    ##  1 Game Of Thrones S01E01 Winter I~ Easy, boy.
    ##  2 Game Of Thrones S01E01 Winter I~ Our orders were to track the wildlings.
    ##  3 Game Of Thrones S01E01 Winter I~ - Right. Give it here. - No!
    ##  4 Game Of Thrones S01E01 Winter I~ Put away your blade.
    ##  5 Game Of Thrones S01E01 Winter I~ - I take orders from your father, not ~
    ##  6 Game Of Thrones S01E01 Winter I~ I'm sorry, Bran.
    ##  7 Game Of Thrones S01E01 Winter I~ Lord Stark?
    ##  8 Game Of Thrones S01E01 Winter I~ There are five pups.
    ##  9 Game Of Thrones S01E01 Winter I~ One for each of the Stark children.
    ## 10 Game Of Thrones S01E01 Winter I~ The direwolf is the sigil of your hous~
    ## # ... with 44,880 more rows

E assim temos os nossos dados brutos, mas há muito o que fazer ainda
para transformá-lo no que consideramos um *tidy dataset*. Vamos por
partes.

Primeiro, podemos concordar que será bom ter como variável a temporada,
o número e nome do episódio.

A minha ideia foi, primeiro, retirar a parte ‘Game of Thrones S’, já que
isso não me serve e também porque será conveniente para separar a
temporada do episódio, já que somente um ‘E’ os está separando (‘01E01’
etc.). Usarei algumas regex para extrair o que quero.

``` r
got_subs <- got_subs_raw %>%
  mutate(
    name = str_remove(name, "Game Of Thrones S"),
    # extraindo a parte com o nº da temporada e do episodio
    season_episode = str_extract(name, "\\d+E\\d+"),
    # extraindo a parte com o nome do episódio
    name = str_match(name, "([A-z,' ]+)\\.srt")[, 2] %>% trimws()
  ) %>%

  # separando a temporada do episódio
  separate(season_episode, c("season", "episode"), sep = "E") %>%

  # transformando o que é número para numeric
  mutate(
    season = as.numeric(season),
    episode = as.numeric(episode)
  ) %>%
  select(season, episode, name, value)

got_subs
```

    ## # A tibble: 44,890 x 4
    ##    season episode name          value
    ##     <dbl>   <dbl> <chr>         <chr>
    ##  1      1       1 Winter Is Co~ Easy, boy.
    ##  2      1       1 Winter Is Co~ Our orders were to track the wildlings.
    ##  3      1       1 Winter Is Co~ - Right. Give it here. - No!
    ##  4      1       1 Winter Is Co~ Put away your blade.
    ##  5      1       1 Winter Is Co~ - I take orders from your father, not you.~
    ##  6      1       1 Winter Is Co~ I'm sorry, Bran.
    ##  7      1       1 Winter Is Co~ Lord Stark?
    ##  8      1       1 Winter Is Co~ There are five pups.
    ##  9      1       1 Winter Is Co~ One for each of the Stark children.
    ## 10      1       1 Winter Is Co~ The direwolf is the sigil of your house.
    ## # ... with 44,880 more rows

Essa já é uma base muito melhor, mas *ainda* não é o melhor para se
analisar dados de texto. Aqui entra o conceito do pacote `tidytext`.
Como em um tidy dataset temos uma unidade de observações por linha,
gostaríamos de ter isso para o texto também. Nesse caso, isso significa
uma palavra para cada linha\! Então, o segredo é que gostaríamos de
separar as legendas em palavras por linha\!

Separar cada linha em palavras é muito fácil de ser feito com este
pacote, basta usar a função `unnest_tokens()`. Queremos também rastrear a que linha cada
palavra pertence, o que pode ser feito com o `dplyr::rownames_to_column()`

``` r
library(tidytext)

got_words <- got_subs %>%
  rownames_to_column() %>%
  unnest_tokens(word, value)

got_words
```

    ## # A tibble: 286,901 x 5
    ##    rowname season episode name             word
    ##    <chr>    <dbl>   <dbl> <chr>            <chr>
    ##  1 1            1       1 Winter Is Coming easy
    ##  2 1            1       1 Winter Is Coming boy
    ##  3 2            1       1 Winter Is Coming our
    ##  4 2            1       1 Winter Is Coming orders
    ##  5 2            1       1 Winter Is Coming were
    ##  6 2            1       1 Winter Is Coming to
    ##  7 2            1       1 Winter Is Coming track
    ##  8 2            1       1 Winter Is Coming the
    ##  9 2            1       1 Winter Is Coming wildlings
    ## 10 3            1       1 Winter Is Coming right
    ## # ... with 286,891 more rows

Vamos contar quais são as palavras mais comuns:

``` r
got_words %>%
  count(word, sort = T)
```

    ## # A tibble: 9,695 x 2
    ##    word      n
    ##    <chr> <int>
    ##  1 the   11856
    ##  2 you   10585
    ##  3 i     10267
    ##  4 to     7864
    ##  5 a      6006
    ##  6 and    5064
    ##  7 of     4430
    ##  8 your   3342
    ##  9 my     3234
    ## 10 it     2962
    ## # ... with 9,685 more rows

Esse é o esperado, a maioria são preposições, pronomes etc., o que não é
muito interessante. Felizmente, isso é muito facilmente resolvido por
esse pacote. Para as eliminarmos, basta fazer um `dplyr::anti_join()`
com um dataset que contém essas palavras, conhecidas como ‘stop
words’.

``` r
got_words <- got_words %>%
  anti_join(stop_words)
```

    ## Joining, by = "word"

``` r
got_words %>%
  count(word, sort = T)
```

    ## # A tibble: 9,079 x 2
    ##    word        n
    ##    <chr>   <int>
    ##  1 lord     1133
    ##  2 king      831
    ##  3 father    693
    ##  4 grace     517
    ##  5 time      513
    ##  6 lady      510
    ##  7 north     412
    ##  8 stark     409
    ##  9 people    394
    ## 10 brother   393
    ## # ... with 9,069 more rows

E aqui vemos algo mais específico de GOT, mas essas palavras são assim tão frequentes
por serem pronomes de tratamento de GOT, são as stop
words desse universo. Por isso, achei prudente retirá-las.

``` r
got_stop_words <- c(
  "father", "mother", "queen", "king",
  "boy", "girl", "lord", "lady", "son", "sister",
  "grace", "ser", "brother", "sister", "king's"
)

got_words <- got_words %>%
  filter(!(word %in% got_stop_words)) %>%
  add_count(word)

got_words %>%
  count(word, sort = T)
```

    ## # A tibble: 9,065 x 2
    ##    word       n
    ##    <chr>  <int>
    ##  1 time     513
    ##  2 north    412
    ##  3 stark    409
    ##  4 people   394
    ##  5 dead     375
    ##  6 kill     349
    ##  7 fight    313
    ##  8 told     295
    ##  9 die      284
    ## 10 life     278
    ## # ... with 9,055 more rows

E aqui as coisas começam a ficar interessantes\! A palavra mais frequente no geral é
time, o que é recorrente em muitos textos, seguida de north, um dos lugares centrais na série.

A base limpa que usaremos no decorrer do post você pode baixar
[aqui](https://raw.githubusercontent.com/phelipetls/phelipetls.github.io/master/assets/got_words.csv) para fazer a análise que quiser.

###### Correlação entre as palavras

Uma das coisas interessantes que podemos fazer com um tidy text em mãos
é ver quais são as palavras que aparecem juntas com mais frequência.
Essa tarefa é bem resolvida pela função `pairwise_cor()` do pacote
`widyr`.

Só precisamos filtrar nossa base antes, porque não queremos que o R faça
compare cada par de 81579 palavras. Vamos adicionar um contador de
palavras à nossa base e filtrar para as palavras que aparecem 50 vezes
ou mais.

``` r
library(widyr)

word_pairs <- got_words %>%
  add_count(word) %>%
  filter(n >= 50) %>%
  pairwise_cor(word,
    rowname,
    sort = T
  )

word_pairs
```

    ## # A tibble: 109,892 x 3
    ##    item1    item2    correlation
    ##    <chr>    <chr>          <dbl>
    ##  1 color    font           0.968
    ##  2 font     color          0.968
    ##  3 rock     casterly       0.908
    ##  4 casterly rock           0.908
    ##  5 watch    night's        0.674
    ##  6 night's  watch          0.674
    ##  7 white    walkers        0.639
    ##  8 walkers  white          0.639
    ##  9 jon      snow           0.540
    ## 10 snow     jon            0.540
    ## # ... with 109,882 more rows

Dentre alguns resultado interessantes, nos deparamos com um bastante
anormal. color font? font color? Isso são linhas de HTML, que não me
interessam. Mas, fora isso, já conseguimos algo proveitoso.

Para visualizar essas relações, vamos usar grafos. Nele as palavras são nós
e os vértices as corrrelações (um vértice mais escuro indica uma correlação mais alta),
teremos assim uma network dos top 100 par de palavras mais correlacionados entre si.

``` r
library(ggraph)
library(igraph)

set.seed(0)

word_pairs %>%
  filter(!(item1 %in% c("font", "color", "game"))) %>%
  top_n(100) %>%
  graph_from_data_frame() %>%
  ggraph(layout = "fr") +
  geom_edge_link(aes(edge_alpha = correlation),
    show.legend = F
  ) +
  geom_node_point(
    color = "skyblue",
    size = 3
  ) +
  geom_node_text(aes(label = name),
    repel = T
  ) +
  theme_void()
```

![](./images/unnamed-chunk-8-1.png)<!-- -->

Esse é uma das visualizações mais legais\! Algumas correlações esperadas
saltam aos olhos: o núcleo da família Stark, dos Lannister, dos Baratheon
e dos Tyrell.

Também podemos ver ali o “winter is coming”, o motto dos Stark, o “hold
the door” e “close the bloody gate” do mesmo episódio icônico, 'The Door'. E várias
outras.

###### Palavras mais frequentes

O plano agora é visualizar quais as palavras mais frequentes em geral e
por temporada. Para isso vamos utilizar nuvem de palavras.

O em geral primeiro. Vamos ver quais são as top 50 palavras em uma
nuvem, com a função `wordcloud::wordcloud()`, que toma como argumentos
principais um vetor de palavras e um de frequências.

``` r
library(wordcloud)
library(RColorBrewer)

paleta <- brewer.pal(6, "Dark2")

set.seed(99)

got_words %>%
  count(word) %>%
  with(wordcloud(word,
    n,
    max.words = 50,
    colors = paleta
  ))
```

![](./images/unnamed-chunk-9-1.png)<!-- -->

Agora, vamos ver como isso varia para cada temporada. Desta vez, será
melhor usarmos um pacote mais integrado ao ggplot2, o `ggwordcloud`.

``` r
library(ggwordcloud)

theme_set(theme_minimal())

got_words <- got_words %>%
  filter(!str_detect(word, "font|color"))

got_words %>%
  count(season, word, name = "count") %>%
  group_by(season) %>%
  top_n(20, count) %>%
  ggplot(aes(
    label = word,
    size = count,
    color = count %>% as.numeric()
  )) +
  geom_text_wordcloud(rm_outside = T) +
  scale_size_area(max_size = 10) +
  scale_color_viridis_c() +
  facet_wrap(. ~ season, nrow = 3, ncol = 3)
```

![](./images/plot_zoom_png.png)<!-- -->

Neste gráfico podemos conferir diversos momentos marcantes de cada temporada em palavras.
Por exemplo, 'hand' na temporada 1, 'stannis' na 2, 'wedding' e 'north' na 3, 'joffrey' na 4, 'shame' na 5, 'hodor' na 6 e, finalmente, 'dead' e 'north' na 7.

###### Análise de sentimentos

Outra coisa que é interessante de ser feita é analisar o sentimento
médio expresso pelo texto. Por exemplo, se nele há mais palavras
consideradas negativas ou positivas etc.

Esse é um tópico delicado teoricamente, já que não é algo tão trivial
para um computador deduzir se uma frase expressa um sentimento bom ou ruim.

A abordagem que vamos adotar é a mais simples, ela considera o
sentimento total de um texto como a soma do sentimento evocado por cada
palavra ou por cada pedaço do texto.

Mas como medir o sentimento expresso por uma palavra? Alguns datasets
nos ajudam a fazer isso. Por exemplo, este dataset classifica algumas mil palavras em uma escala que varia de -5 (muito
negativo) até 5 (muito positivo).

``` r
get_sentiments("afinn")
```

    ## # A tibble: 2,476 x 2
    ##    word       score
    ##    <chr>      <int>
    ##  1 abandon       -2
    ##  2 abandoned     -2
    ##  3 abandons      -2
    ##  4 abducted      -2
    ##  5 abduction     -2
    ##  6 abductions    -2
    ##  7 abhor         -3
    ##  8 abhorred      -3
    ##  9 abhorrent     -3
    ## 10 abhors        -3
    ## # ... with 2,466 more rows

Já esse classifica cada palavra binariamente, em ‘negativa’ ou ‘positiva’,
cobrindo uma porção maior de palavras.

``` r
get_sentiments("bing")
```

    ## # A tibble: 6,788 x 2
    ##    word        sentiment
    ##    <chr>       <chr>
    ##  1 2-faced     negative
    ##  2 2-faces     negative
    ##  3 a+          positive
    ##  4 abnormal    negative
    ##  5 abolish     negative
    ##  6 abominable  negative
    ##  7 abominably  negative
    ##  8 abominate   negative
    ##  9 abomination negative
    ## 10 abort       negative
    ## # ... with 6,778 more rows


Outra base possível de ser usada é essa, que cobre muito mais palavras e categorias, além de ter mais palavras positivas (em relação às negativas) que a base 'bing'.

``` r
get_sentiments("nrc")
```

    ## # A tibble: 13,901 x 2
    ##    word        sentiment
    ##    <chr>       <chr>
    ##  1 abacus      trust
    ##  2 abandon     fear
    ##  3 abandon     negative
    ##  4 abandon     sadness
    ##  5 abandoned   anger
    ##  6 abandoned   fear
    ##  7 abandoned   negative
    ##  8 abandoned   sadness
    ##  9 abandonment anger
    ## 10 abandonment fear
    ## # ... with 13,891 more rows

Vamos aplicar a análise de sentimento com base nas três e ver o que elas nos mostram.

Vejamos primeiro quais são as palavras negativas e positivas mais
comuns.

``` r
got_bing <- got_words %>%
  filter(word != "stark") %>%
  select(-rowname) %>%
  inner_join(get_sentiments("bing"))
```

    ## Joining, by = "word"

``` r
got_bing %>%
  distinct(word, .keep_all = T) %>%
  group_by(sentiment) %>%
  top_n(10, n) %>%
  ggplot(aes(fct_reorder(word, n),
    n,
    fill = sentiment
  )) +
  geom_col(show.legend = F) +
  coord_flip() +
  facet_wrap(. ~ sentiment, scale = "free_y") +
  labs(
    x = NULL, y = NULL,
    title = "Palavras Negativas e Positivas Mais Comuns"
  )
```

![](./images/unnamed-chunk-13-1.png)<!-- -->

Em análise de texto, é interessante buscar visualizar quais partes dele
são mais negativas ou positivas. O que me interessa aqui é ver isso por temporada.

Farei isso dividindo o texto em seções. Para isso, vamos indexar cada linha
com o número da linha e depois aplicar a divisão inteira para separar o texto em pedaços
formados por n palavras.

Vamos usar o dataset `afinn` agora, e calcular o sentimento médio de
cada pedaço do texto em cada seção, para cada temporada.

``` r
got_afinn <- got_words %>%
  inner_join(get_sentiments("afinn")) %>%
  select(-rowname, -n) %>%
  mutate(
    row = row_number(),
    section = row %/% 25
  ) %>%
  ungroup()
```

    ## Joining, by = "word"

``` r
got_afinn %>%
  group_by(season, section) %>%
  summarise(avg_sentiment = mean(score)) %>%
  ggplot(aes(section,
    avg_sentiment,
    fill = avg_sentiment
  )) +
  geom_col(show.legend = F) +
  labs(
    x = "Seções", y = "Sentimento médio\n",
    title = "Sentimento médio a cada 25 palavras por temporada"
  ) +
  scale_fill_gradient2(
    low = "firebrick3",
    high = "dodgerblue3"
  ) +
  facet_wrap(season ~ ., scale = "free_x")
```

![](./images/unnamed-chunk-15-1.png)<!-- -->

Em geral, podemos ver que as temporadas foram ficando mais pesadas. Os
picos azuis claros foram ficando cada vez mais raros e os vales
vermelhos mais agudos, chegando a seu clímax na temporada 5, o Walk of
Shame.

Vamos tentar o mesmo com as outras duas bases. Como elas classificam as
palavras binariamente, a ideia é calcular o 'sentimento líquido', o que se
entende pela diferença no número de palavras positivas e negativas, para cada
seção.

``` r
got_bing %>%
  select(-n) %>%
  mutate(
    row = row_number(),
    section = row %/% 25
  ) %>%
  count(season, episode, section, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(net_sentiment = positive - negative) %>%
  ggplot(aes(section,
    net_sentiment,
    fill = net_sentiment
  )) +
  geom_col(show.legend = F) +
  scale_fill_gradient2(
    low = "firebrick3",
    high = "navyblue"
  ) +
  facet_wrap(. ~ season, scale = "free_x") +
  labs(
    x = "Seções", y = "Sentimento médio\n",
    title = "Sentimento médio a cada 25 palavras por temporada",
    subtitle = "Método Bing"
  )
```

![](./images/unnamed-chunk-17-1.png)<!-- -->

Ok, isso em geral vai de encontro com o que já havíamos visto.

``` r
got_nrc <- got_words %>%
  filter(word != "stark") %>%
  select(-rowname) %>%
  inner_join(get_sentiments("nrc") %>%
    filter(sentiment %in% c("negative", "positive")))
```

    ## Joining, by = "word"

``` r
got_nrc %>%
  select(-n) %>%
  mutate(
    row = row_number(),
    section = row %/% 25
  ) %>%
  count(season, episode, section, sentiment) %>%
  spread(sentiment, n, fill = 0) %>%
  mutate(net_sentiment = positive - negative) %>%
  ggplot(aes(section,
    net_sentiment,
    fill = net_sentiment
  )) +
  geom_col(show.legend = F) +
  scale_fill_gradient2(
    low = "firebrick3",
    high = "navyblue"
  ) +
  facet_wrap(. ~ season, scale = "free_x") +
  labs(
    x = "Seções", y = "Sentimento médio\n",
    title = "Sentimento médio a cada 25 palavras por temporada",
    subtitle = "Método NRC"
  )
```

![](./images/unnamed-chunk-18-1.png)<!-- -->

Pera! Já esse nos dá quase que o resultado oposto! De fato, por esse método
a série não parece ser tão negativa quanto os outros haviam sugerido. Isso porque
essa base tem muito mais palavras positivas em relação a negativas. Palavras como 'land',
'prince' etc. são nela 'positivas', enquanto que nas outras, não. Por ter mais palavras,
aumentam também o número de seções.

Enfim, esse é um ponto delicado. Não sei que método é o mais aplicado a GOT, mas é
válida a menção pelo conhecimento. Diria porém que a última é um retrato mais fidedigno,
porque a série não é feita somente de momentos negativos como poderíamos ter concluído com
as outras. E ao menos numa coisa todas elas concordam: o Walk of Shame foi bem punk.

Uma limitação dessa análise é que a série não se vale somente de palavras para
transmitir o que tá acontecendo, então o resultado só poderia ser parcial.
Algo mais efetivo seria aplicar o mesmo aos livros.
