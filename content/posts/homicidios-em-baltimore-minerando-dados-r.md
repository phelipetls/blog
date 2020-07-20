---
layout: post
title: "Extraindo dados de texto com RegEx no R"
date: 2019-04-01
tags: ["tidyverse", "regex", "r"]
comments: true
---

Quando comecei a estudar R, via muito os vídeos do Roger Peng, que
tem séries maravilhosas sobre muitos assuntos relacionados à linguagem.
Um dos meus favoritos é um em que ele explora uma base de dados bastante
bagunçada, de puro texto, em que ele usa [Regular Expressions](https://youtu.be/q8SzNKib5-4) para
extrair o máximo de informações dali.

Neste post, pretendo explorar essa base mais a fundo, para depois, em um
outro post, visualizar com o ggplot2 as informações coletadas.

A base de dados é um pouco soturna: trata-se de registros de
homicídios na cidade de Baltimore, em Maryland, com detalhes incluindo a raça da vítima, seu sexo, o local em que morreu, a causa da morte etc.

``` r
library(tidyverse)

homicides <- read_lines("https://raw.githubusercontent.com/hadv/PAR/master/homicides.txt")

homicides %>% head(3)
```

    ## [1] "39.311024, -76.674227, iconHomicideShooting, 'p2', '<dl><dt>Leon Nelson</dt><dd class=\"address\">3400 Clifton Ave.<br />Baltimore, MD 21216</dd><dd>black male, 17 years old</dd><dd>Found on January 1, 2007</dd><dd>Victim died at Shock Trauma</dd><dd>Cause: shooting</dd></dl>'"
    ## [2] "39.312641, -76.698948, iconHomicideShooting, 'p3', '<dl><dt>Eddie Golf</dt><dd class=\"address\">4900 Challedon Road<br />Baltimore, MD 21207</dd><dd>black male, 26 years old</dd><dd>Found on January 2, 2007</dd><dd>Victim died at scene</dd><dd>Cause: shooting</dd></dl>'"
    ## [3] "39.309781, -76.649882, iconHomicideBluntForce, 'p4', '<dl><dt>Nelsene Burnette</dt><dd class=\"address\">2000 West North Ave<br />Baltimore, MD 21217</dd><dd>black female, 44 years old</dd><dd>Found on January 2, 2007</dd><dd>Victim died at scene</dd><dd>Cause: blunt force</dd></dl>'"

Como podemos ver, a base está de fato bastante suja. Quer dizer,
é somente texto, nada está estruturado. O objetivo aqui é extrair o máximo
de informações que pudermos. E perceba que elas são registradas de uma maneira padronizada. Por exemplo,
a coordenada geográfica sempre vêm primeiro; a causa da morte vem depois
de “Cause: ”; a raça, o sexo e a idade vêm todas numa tacada só, “black
male, 17 years old”. Logo, como poderíamos tirar vantagem disso?

##### Expressões regulares (RegEx)

O melhor modo de proceder é com Expressões Regulares, ou
RegEx, que é, digamos, uma “linguagem” para encontrar padrões em
strings, para daí extrair, substituir, remover etc.

Como em toda linguagem, nela há uma série de caracteres especiais (metacharacters) com significados específicos, podendo expressar
uma classe de caracteres, ou uma quantidade deles, ou uma condição lógica etc.

Abaixo, uma lista sumária dos mais básicos. Tenha em mente que aqui não pretendo me prolongar tanto nisto. O resto
irei introduzindo ao longo do texto.

|  Qualitativos | Combina com:                           |
| :---------------------------: | :------------------------------------- |
| ```\w```                          | qualquer caractere alfanúmerico ou \_ |
| ```\d```                          | qualquer número |
| ```\s```                          | qualquer espaço |
| ```.```                          | qualquer coisa |


| Quantitativos | Significa que:                                                            |
| :----------------------------: | :---------------------------------------------------------------------- |
| ```?```                            | o caractere precedente é opcional                           |
| ```+```                           | o caractere precedente é obrigatório                        |
| ```*```                           | o caractere é opcional, podendo ocorrer nenhuma ou muitas vezes |
| ```{m,n}```                           | pode ocorrer no mínimo m, no máximo n vezes |

Vale mencionar ainda o significado dos colchetes e dos parênteses.

Os parênteses servem para formar grupos dentro da regex, o que pode ter muitas utilidades, mas a que mais vamos explorar é a de extrair um determinado grupo da string.

Já quando encapsulamos caracteres em colchetes, queremos que a string dê match com qualquer um que colocamos lá dentro. Eles formam um ambiente próprio, as regras mudam um pouco e até aceitam intervalos de caracteres! Por exemplo, ```[a-e]``` combina com "a", "c" ou "e", ```[csa]+``` combina com "casa", e  ```\w``` equivale a ```[A-z0-9_]```.

<div class="divider"></div>


#### Extraindo as variáveis com stringr

Para extrairmos os dados do texto, vamos usar o pacote stringr do tidyverse, mais especificamente
a função ```stringr::str_match```, que extrai de uma string o padrão e seus grupos.

###### Causa da morte

Ok, agora mão na massa, vamos começar pela causa da morte. As primeiras
linhas indicam que ela é registrada deste modo: “Cause: *descrição*”,
sendo a descrição uma string de letras (```\w```) e espaços (```\s```), logo, tente
perceber que a regex apropriada é ```Cause: [\\w\\s]+```: uma combinação de uma
ou mais letras e espaços, precedida de “Cause: ”.

E queremos, na verdade, somente essa combinação, esse prefixo não
nos interessa. Por isso, colocamos eles entre parênteses, formando um grupo, que
extraíremos da linha com a função `stringr::str_match`.

``` r
# note que, no r, precisamos infelizmente
# adicionar uma \ a mais no regex
causes <- str_match(homicides,
                    "Cause: ([\\w\\s]+)")

causes %>% head()
```

    ##      [,1]                  [,2]
    ## [1,] "Cause: shooting"     "shooting"
    ## [2,] "Cause: shooting"     "shooting"
    ## [3,] "Cause: blunt force"  "blunt force"
    ## [4,] "Cause: asphyxiation" "asphyxiation"
    ## [5,] "Cause: blunt force"  "blunt force"
    ## [6,] "Cause: shooting"     "shooting"

Veja que ele fez o esperado. A regex combinou com a parte da linha que
imaginávamos e na segunda coluna temos extraída a informação que nos
interessa. É esse o procedimento geral que vamos adotar aqui.

###### Latitude e Longitude

Outra informação importante é a coordenada geográfica. As strings que as
representam são formadas por números ```\d```, sinais de menos, ```-``` e pontos
```.```. Para indicar que queremos um match no começo da linha, usaremos o
metacharacter ```^```. Observe que, dentro dos colchetes, o ```.``` não é um
metacharacter, mas um ponto comum mesmo.

``` r
lat_long <- str_match(homicides,
                      "^([\\d.-]+), ([\\d.-]+)")

lat_long %>% head
```

    ##      [,1]                    [,2]        [,3]
    ## [1,] "39.311024, -76.674227" "39.311024" "-76.674227"
    ## [2,] "39.312641, -76.698948" "39.312641" "-76.698948"
    ## [3,] "39.309781, -76.649882" "39.309781" "-76.649882"
    ## [4,] "39.363925, -76.598772" "39.363925" "-76.598772"
    ## [5,] "39.238928, -76.602718" "39.238928" "-76.602718"
    ## [6,] "39.352676, -76.607979" "39.352676" "-76.607979"

###### Raça

Outra coisa em que estamos interessados é na raça da pessoa. Mas devo
adiantar que essa não vai ser tão fácil. Isso porque o modo de registrar
vai mudar mais para frente.

No início o registro é do tipo “black male” etc., enquanto que, mais
para o final, se registra assim, “Race: black”. Temos que lidar com
isso. Podemos indicar que desejamos um match numa regex OU em outra com o
metacharacter ```|```. Daí que:

``` r
raca <- str_match(homicides,
                  "<dd>(\\w+) (fe)?male|[Rr]ace: (\\w+)")

raca %>% head
```

    ##      [,1]               [,2]    [,3] [,4]
    ## [1,] "<dd>black male"   "black" NA   NA
    ## [2,] "<dd>black male"   "black" NA   NA
    ## [3,] "<dd>black female" "black" "fe" NA
    ## [4,] "<dd>black male"   "black" NA   NA
    ## [5,] "<dd>white male"   "white" NA   NA
    ## [6,] "<dd>black male"   "black" NA   NA

``` r
raca %>% tail
```

    ##         [,1]          [,2] [,3] [,4]
    ## [1245,] "Race: Black" NA   NA   "Black"
    ## [1246,] "Race: Black" NA   NA   "Black"
    ## [1247,] "Race: Black" NA   NA   "Black"
    ## [1248,] "Race: Black" NA   NA   "Black"
    ## [1249,] "Race: Black" NA   NA   "Black"
    ## [1250,] "Race: Black" NA   NA   "Black"

Veja que, inseri um grupo a mais para indicar que é opcional todo o
grupo “fe” em sexo, ele pode ou não ocorrer. Daí que o uso de grupos
pode não ser somente para extrair.

###### Gênero

Esse caso é muito similar ao anterior, mudando de maneira idêntica no
registro. Então vamos logo tratá-lo.

``` r
genero <- str_match(homicides,
                    "<dd>\\w* (\\w+),?|[Gg]ender: (\\w+)")

genero %>% head
```

    ##      [,1]                [,2]     [,3]
    ## [1,] "<dd>black male,"   "male"   NA
    ## [2,] "<dd>black male,"   "male"   NA
    ## [3,] "<dd>black female," "female" NA
    ## [4,] "<dd>black male,"   "male"   NA
    ## [5,] "<dd>white male,"   "male"   NA
    ## [6,] "<dd>black male,"   "male"   NA

``` r
genero %>% tail
```

    ##         [,1]             [,2] [,3]
    ## [1245,] "Gender: male"   NA   "male"
    ## [1246,] "Gender: male"   NA   "male"
    ## [1247,] "Gender: male"   NA   "male"
    ## [1248,] "Gender: female" NA   "female"
    ## [1249,] "Gender: male"   NA   "male"
    ## [1250,] "Gender: male"   NA   "male"

###### Idade

E aqui a mesma coisa ocorre, vamos usar duas regex para dar conta disso:

``` r
idade <- str_match(homicides,
                   "(\\d+) years? old|[Aa]ge: (\\d+)")

idade %>% head
```

    ##      [,1]           [,2] [,3]
    ## [1,] "17 years old" "17" NA
    ## [2,] "26 years old" "26" NA
    ## [3,] "44 years old" "44" NA
    ## [4,] "21 years old" "21" NA
    ## [5,] "61 years old" "61" NA
    ## [6,] "46 years old" "46" NA

``` r
idade %>% tail
```

    ##         [,1]      [,2] [,3]
    ## [1245,] "Age: 30" NA   "30"
    ## [1246,] "Age: 35" NA   "35"
    ## [1247,] "Age: 27" NA   "27"
    ## [1248,] "Age: 84" NA   "84"
    ## [1249,] "Age: 62" NA   "62"
    ## [1250,] "Age: 65" NA   "65"

###### Data

Outra informação bastante valiosa é a data do crime. Pelas primeiras
linhas, vemos que ela normalmente vem depois de “Found on”, então
provavelmente usaremos essa informação.

Mas também temos que criar uma regex para data. A data é formada:

  - pelo mês por extenso, ```\w+```
  - seguido pelo dia, que pode ter no mínimo um e no máximo 2 dígitos
  - seguido por uma vírgula
  - e, por fim, o ano, um número de 4 dígitos

Dito isto, a regex adequada é a do código. Alumas linhas tinham um
espaço adicional entre o mês e o dia, por isso adicionei um " ?" ali.

``` r
data <- str_match(homicides,
                  "[Ff]ound on (\\w+  ?\\d{1,2}, \\d{4})")

data %>% head
```

    ##      [,1]                       [,2]
    ## [1,] "Found on January 1, 2007" "January 1, 2007"
    ## [2,] "Found on January 2, 2007" "January 2, 2007"
    ## [3,] "Found on January 2, 2007" "January 2, 2007"
    ## [4,] "Found on January 3, 2007" "January 3, 2007"
    ## [5,] "Found on January 5, 2007" "January 5, 2007"
    ## [6,] "Found on January 5, 2007" "January 5, 2007"


###### Endereço

Também pode ser interessante termos disponível o endereço de cada morte:

``` r
endereco <- str_match(homicides,
                      ">([A-z0-9 .]+)<br ?/>")

endereco %>% head
```

    ##      [,1]                          [,2]
    ## [1,] ">3400 Clifton Ave.<br />"    "3400 Clifton Ave."
    ## [2,] ">4900 Challedon Road<br />"  "4900 Challedon Road"
    ## [3,] ">2000 West North Ave<br />"  "2000 West North Ave"
    ## [4,] ">5900 Northwood Drive<br />" "5900 Northwood Drive"
    ## [5,] ">500 Maude Ave.<br />"       "500 Maude Ave."
    ## [6,] ">5200 Ready Ave.<br />"      "5200 Ready Ave."

E presumo que seja isso. Se foi complicado, pode ser que esse não seja o post mais didático mesmo.
Mas que fique claro que 90% do processo aqui envolveu ver onde estavam os ```NA```,
por quê, para daí ver onde poderia melhorar a regex etc. Importante considerar também que é muito mais fácil escrever regex
do que as ler. Então tente você mesmo esse exercício.

###### Agregando tudo em um data.frame

Agora precisamos juntar tudo num data.frame. Vamos pegar só
as colunas dos grupos que nos interessam.

Há casos em que há duas colunas para duas regex alternativas, e
precisamos mesclá-las (substiruir os ```NA``` de uma com os valores da outra).
Vou usar a função ```ifelse``` para isso.

``` r
causas              <- causes[, 2]
lat                 <- long_lat[, 2]
lon                 <- long_lat[, 3]
raca                <- ifelse(is.na(raca[, 2]), raca[, 4], raca[, 2])
genero              <- ifelse(is.na(genero[, 2]), genero[, 3], genero[, 2])
idade               <- ifelse(is.na(idade[, 2]), idade[, 3], idade[, 2])
data                <- data[, 2]
endereco            <- endereco[, 2]

homicides_df        <- tibble(causas,
                              lon, lat,
                              raca, genero, idade,
                              data,
                              endereco)

homicides_df %>% head
```

    ## # A tibble: 6 x 8
    ##   causas     lon      lat      raca  genero idade data       endereco
    ##   <chr>      <chr>    <chr>    <chr> <chr>  <chr> <chr>      <chr>
    ## 1 shooting   -76.674~ 39.3110~ black male   17    January 1~ 3400 Clifton ~
    ## 2 shooting   -76.698~ 39.3126~ black male   26    January 2~ 4900 Challedo~
    ## 3 blunt for~ -76.649~ 39.3097~ black female 44    January 2~ 2000 West Nor~
    ## 4 asphyxiat~ -76.598~ 39.3639~ black male   21    January 3~ 5900 Northwoo~
    ## 5 blunt for~ -76.602~ 39.2389~ white male   61    January 5~ 500 Maude Ave.
    ## 6 shooting   -76.607~ 39.3526~ black male   46    January 5~ 5200 Ready Av~

E terminamos nossa limpeza dos dados. Na verdade, seria bom fazer algumas coisinhas antes, do tipo, uniformizar os valores das variáveis (alguns estão escritos em minúsculo enquanto outros não etc.), mudar o tipo das variáveis (a data precisa estar no formato Date) etc:

``` r
homicides_df <- homicides_df %>%
  mutate_at(vars(causas, raca, genero),
            list(~str_to_title)) %>%
  mutate_at(vars(lon, lat),
            list(~as.numeric)) %>%
  mutate(data = parse_date(data, "%B %d, %Y"))

homicides_df %>% head
```

    ## # A tibble: 6 x 8
    ##   causas         lon   lat raca  genero idade data       endereco
    ##   <chr>        <dbl> <dbl> <chr> <chr>  <chr> <date>     <chr>
    ## 1 Shooting     -76.7  39.3 Black Male   17    2007-01-01 3400 Clifton Ave.
    ## 2 Shooting     -76.7  39.3 Black Male   26    2007-01-02 4900 Challedon Ro~
    ## 3 Blunt Force  -76.6  39.3 Black Female 44    2007-01-02 2000 West North A~
    ## 4 Asphyxiation -76.6  39.4 Black Male   21    2007-01-03 5900 Northwood Dr~
    ## 5 Blunt Force  -76.6  39.2 White Male   61    2007-01-05 500 Maude Ave.
    ## 6 Shooting     -76.6  39.4 Black Male   46    2007-01-05 5200 Ready Ave.


E assim conseguimos uma base que pode render visualizações promissoras. Podemos olhar como a violência afeta pessoas de diferentes raças, idades e gêneros, ou até mesmo investigar a distribuição geográfica dos crimes!! E é exatamente isso o que eu pretendo fazer num post em breve. :smiley:
