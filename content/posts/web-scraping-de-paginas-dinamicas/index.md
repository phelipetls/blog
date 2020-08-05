---
layout: post
title: "Web Scraping de páginas dinâmicas com Python"
date: 2019-08-18
categories: ["Programming", "Python"]
tags: ["web-scraping", "pandas", "regex", "dataviz"]
aliases: ["/web-scraping-de-paginas-dinamicas"]
---

Web scraping pode ficar bem complicado quando a página é dinâmica, você não
mais precisa somente carregar o código-fonte da página mas também precisar o
JavaScript da página construir a página em si, que é o caso do site do Reclame Aqui.

Nesses casos, precisamos permitir que um navegador seja controlado remotamente
com um *web driver*, por exemplo, `geckodriver` para o Firefox ou
`chromedriver` para o Chrome.

Também precisamos usar uma biblioteca a partir da qual podemos instruir o
navegador a fazer o que queremos. A mais famosa é o `Selenium`.

Devemos instruir o Selenium em que site ir e o que ele deve fazer. No post que
segue, iremos usá-lo simplesmente para extrair informações da página, o que
pode ser feito com o próprio `Selenium` ou uma biblioteca que entenda estrutura
HTML e facilite isso pra gente, como a `BeautifulSoup`.

Para instalá-los:

```sh
pip instal selenium bs4
```

Para fazer o crawleamento, criei uma classe que aceita o nome de uma
empresa e o web driver a ser utilizado.

Ela tem o método `ReclameAqui.extrair_informacoes(n_paginas)` que vai extrair
os links e títulos das reclamações das primeiras `n_paginas`.

Outro método, o `ReclameAqui.extrair_descricoes()`, abre cada uma dessas URLs e
extrai as descrições das informações.

Aqui entra o BeautifulSoup. Por exemplo, para extrair a informação do
título, precisamos inspecionar o HTML da página. Basta que você clique
no elemento de interesse com o botão direito do mouse e te aparecerá
essa opção. Uma tela vai surgir para que você identifique as tags do
elemento de HTML. Por exemplo, ele pode ser um "p" ou uma "div", e ter
uma "classe" ou um "id" etc.

Daí que, uma vez que você tenha transformado o código fonte em um objeto
do BeautifulSoup, ele vai conseguir facilmente extrair os elementos que
têm as características que você especificou com os métodos `find` ou
`find_all`.

``` python
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
