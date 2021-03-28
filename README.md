# French libraries and schools search

## Ontology

<p align="center"><img  src="https://raw.githubusercontent.com/VLNTNF/school-library-search/main/images/ontology.png" width="80%"></p>

## How to install

### Server launch and queries

Download Jena Fuseki Server available at : https://jena.apache.org/download/

Then, launch **fuseki-server.bat** and write in a cmd `.\fuseki-server.bat --update --mem /ds`

It should look like that :

<p align="center"><img  src="https://raw.githubusercontent.com/VLNTNF/school-library-search/main/images/server.png" width="80%"></p>

Go to **http://localhost:3030/** and import **project.ttl**.

You can now query on your data :

<p align="center"><img  src="https://raw.githubusercontent.com/VLNTNF/school-library-search/main/images/query.png" width="70%"></p>
<br>

### Website

Simply click on **index.html** or go to **https://school-library-search.herokuapp.com/**

<p align="center"><img  src="https://raw.githubusercontent.com/VLNTNF/school-library-search/main/images/website.png" width="70%"></p>
<br>

## How to use

Enter your zipcode, then select your establishment and your filters. Click **search**.  
Good job, you're done!

<p align="center"><img  src="https://raw.githubusercontent.com/VLNTNF/school-library-search/main/images/website.png" width="70%"></p>
