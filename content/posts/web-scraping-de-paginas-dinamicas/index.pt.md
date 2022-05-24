---
layout: post
title: "Web Scraping de páginas dinâmicas com Python"
date: 2019-08-18
tags: ["web-scraping", "pandas", "regex", "dataviz"]
aliases: ["/web-scraping-de-paginas-dinamicas"]
---

Web scraping pode ficar bem complicado quando a página é dinâmica, você não mais
precisa somente carregar o código-fonte da página mas também precisa esperar o
JavaScript da página construir a página, que é o caso do site do Reclame Aqui.

Nesses casos, precisamos controlar um navegador remotamente por meio de um _web
driver_, por exemplo, o `geckodriver` para o Firefox ou `chromedriver` para o
Chrome.

Para isso, usamos uma biblioteca a partir da qual podemos instruir este
navegador a fazer o que queremos, por exemplo o `Selenium`.

Pros meus propósitos, usarei o `Selenium` para abrir uma URL e extrair alguma
informação na página, tarefa para alguma biblioteca que entenda estrutura HTML e
facilite a extração dos elementos, como a `BeautifulSoup`.

Utilizo essas duas bibliotecas no script abaixo. E podemos instalá-las com:

```shell-sesson
$ pip3 instal selenium bs4
```

Para fazer o crawleamento, criei uma classe que aceita o nome de uma empresa e o
web driver a ser utilizado.

Ela tem o método `ReclameAqui.extrair_informacoes(n_paginas)` que vai extrair os
links e títulos das reclamações das primeiras `n_paginas`.

Outro método, o `ReclameAqui.extrair_descricoes()`, abre cada uma dessas URLs e
extrai as descrições das informações.

Para extrair a informação desejada, nós fazemos o `BeautifulSoup` "entender" o
código-fonte primeiro para depois usarmos os métodos para extração de algum
element do HTML.

Por exemplo, para extrair o título e os links das reclamações em cada página,
procuramos por parágrafos que contenham a classe `text-detail`:
(`<p class='text-detail'></p>`), e depois procuramos elementos `a`, que contém o
título dentro dele e o link dentro do atributo `href`.

Já para a descrição, procuramos por um elemento `div` com a classe
`complain-body`, e extraímos o texto dentro dele.

```python
from time import sleep
from selenium import webdriver
from bs4 import BeautifulSoup as bs


class ReclameAqui:

    base_url = "https://www.reclameaqui.com.br/empresa/"

    def __init__(self, driver, empresa):
        self.driver = driver
        self.empresa = empresa

    def extrair_informacoes(self, n_paginas):
        url = self.base_url + self.empresa + "/lista-reclamacoes/?pagina="
        self.reclamacoes, self.titulos, self.links = [], [], []

        for i in range(1, n_paginas + 1):
            self.driver.get(url + str(i))
            sleep(3)
            html = bs(self.driver.page_source, "html.parser")

            reclamacoes_html = html.find_all("p", {"class": "text-detail"})
            reclamacoes_na_pagina = [
                reclamacao.text.split("|") for reclamacao in reclamacoes_html
            ]
            self.reclamacoes.extend(reclamacoes_na_pagina)

            titulos_e_links = html.find_all(
                "a", {"class": "link-complain-id-complains"}
            )
            self.titulos.extend([titulo.text.strip() for titulo in titulos_e_links])
            self.links.extend([link.get("href") for link in titulos_e_links])

    def extrair_descricoes(self):
        urls = [self.base_url + link[1:] for link in self.links]
        self.descricoes = []
        for url in urls:
            self.driver.get(url)
            sleep(3)
            html = bs(self.driver.page_source, "html.parser")
            descricao = html.find("div", {"class": "complain-body"}).text.strip()
            self.descricoes.append(descricao)
```

Esse código deve funcionar para qualquer empresa contanto que a estrutura do
HTML do ReclameAqui não mude (isto é, o nome das classes e o tipo dos elementos
onde as informações se encontram).
