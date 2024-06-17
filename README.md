# Company Data Enrichment Web App

## Descriere Proiect

Această aplicație web îmbogățește datele despre companii utilizând setul de date Veridion și surse externe de date, cum ar fi News API și Google Places API. Utilizatorii pot introduce o listă de companii, iar aplicația generează un raport detaliat pentru fiecare companie, incluzând informații relevante din Veridion, articole de știri și detalii de pe Google Places.

## Caracteristici Cheie

- **Îmbogățirea Datelor**: Integrează date din setul de date Veridion cu surse externe, cum ar fi News API și Google Places API.
- **Design Responsiv**: Aplicația funcționează perfect pe diferite dispozitive și dimensiuni de ecran.
- **Componente SEO**: Utilizează `react-helmet` pentru gestionarea meta tagurilor, îmbunătățind SEO.
- **Experiența Utilizatorului**: Procesul de introducere a datelor companiilor și vizualizarea rapoartelor este intuitiv și ușor de utilizat.
- **Optimizarea Performanței**: Implementează paginare și redare condiționată pentru a gestiona eficient seturile mari de date.

## Tehnologii Utilizate

- **Frontend**: React, React Helmet, CSS
- **Backend**: Node.js, Express
- **APIs**: News API, Google Places API
- **Database**: Local CSV file for Veridion dataset
- **Deployment**: Not specified, can be deployed on any platform supporting Node.js

## Structura Proiectului

- `client`: Directorul pentru aplicația React (frontend)
  - `components`: Conține componentele React (CompanyForm, Report, Dashboard)
  - `App.js`: Componenta principală care gestionează starea aplicației și fluxul de lucru
  - `index.js`: Punctul de intrare al aplicației React
  - `public`: Fișiere publice
  - `src`: Cod sursă
- `server`: Directorul pentru serverul Node.js (backend)
  - `server.js`: Configurarea și rularea serverului Express
  - `dataFetch.js`: Funcții utilitare pentru extragerea datelor din diverse surse
- `data`: Directorul care conține setul de date Veridion (CSV file)

## Cum Funcționează

1. **Introducerea Datelor Companiei**:
   - Utilizatorii introduc numele, adresa și domeniul companiilor prin intermediul unui formular.
   - Formularul permite adăugarea mai multor companii și validează datele înainte de trimitere.

2. **Îmbogățirea Datelor**:
   - La trimiterea formularului, datele sunt trimise la serverul backend.
   - Serverul procesează fiecare companie și extrage date din setul de date Veridion, News API și Google Places API.
   - Datele sunt compilate și trimise înapoi la frontend.

3. **Generarea Rapoartelor**:
   - Frontend-ul afișează datele într-un mod prietenos cu utilizatorul.
   - Utilizatorii pot comuta între diferitele tipuri de date (Veridion, Știri, Google Places) și pot vizualiza un rezumat al tuturor companiilor într-un tablou de bord.

## Configurarea și Rularea Proiectului Local

### Prerequisites

- Node.js
- NPM
- Un API key pentru News API
- Un API key pentru Google Places API

### Instalarea și Rularea Backend-ului

1. Clonați repository-ul:
   ```bash
   git clone https://github.com/your-username/company-enrichment-app.git
   cd company-enrichment-app/server
   ```

2. Instalați dependențele:
   ```bash
   npm install
   ```

3. Creați un fișier `.env` în directorul `server` și adăugați următoarele variabile:
   ```env
   PORT=5000
   NEWS_API_KEY=your_news_api_key
   GOOGLE_PLACES_API_KEY=your_google_places_api_key
   ```

4. Rulați serverul:
   ```bash
   npm start
   ```

### Instalarea și Rularea Frontend-ului

1. Într-un alt terminal, navigați la directorul `client`:
   ```bash
   cd ../client
   ```

2. Instalați dependențele:
   ```bash
   npm install
   ```

3. Rulați aplicația React:
   ```bash
   npm start
   ```

4. Deschideți browser-ul și accesați `http://localhost:3000`.

### Structura Fișierelor

- `client/src/components/CompanyForm.js`: Formularul pentru introducerea datelor companiilor.
- `client/src/components/Report.js`: Componenta pentru redarea rapoartelor companiilor.
- `client/src/components/Dashboard.js`: Componenta pentru vizualizarea tabloului de bord.
- `client/src/App.js`: Componenta principală care gestionează starea aplicației și fluxul de lucru.
- `server/server.js`: Configurarea și rularea serverului Express.
- `server/dataFetch.js`: Funcții utilitare pentru extragerea datelor din diverse surse.

### Note Suplimentare

- Asigurați-vă că setul de date Veridion (`veridion_dataset.csv`) este plasat în directorul `server/data`.
- Utilizați variabilele de mediu pentru cheile API și alte informații sensibile.

## Concluzie

Această aplicație web demonstrează capacitatea de a lucra cu date, integrând multiple surse și prezentând informațiile într-un mod intuitiv și prietenos cu utilizatorul. Abordarea asigură îmbogățirea cuprinzătoare a datelor, un design responsiv și o performanță optimizată, aliniindu-se bine cu obiectivele și cerințele proiectului.