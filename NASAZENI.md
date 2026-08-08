# GOODGOOD.cz — návod na nasazení

Postupujte popořadě. Všechno je klikání v prohlížeči. Když se kdekoliv zaseknete,
napište mi, u kterého kroku jste a co vidíte na obrazovce.

---

## KROK 1 — Nahrát web na GitHub (~10 minut)

1. Přihlaste se na github.com.
2. Vpravo nahoře **+** → **New repository**.
   - Repository name: `goodgood-web`
   - Nastavte **Public** (nutné kvůli přihlašování do adminu zdarma; na webu je stejně všechno veřejné)
   - Nezaškrtávejte „Add a README" — nechte repozitář prázdný.
   - **Create repository**.
3. Na stránce nového repozitáře klikněte na odkaz **uploading an existing file**.
4. Rozbalte si ZIP `goodgood-web.zip` u sebe v počítači a **přetáhněte do okna GitHub celý OBSAH složky** (ne složku samotnou — soubory `package.json`, `.eleventy.js` a složky `src`, `admin`, `assets`, `media`).
   - Pozn.: GitHub přes prohlížeč zachová strukturu složek, stačí vše označit a přetáhnout najednou.
5. Dole tlačítko **Commit changes**.

## KROK 2 — Zapnout hosting na Cloudflare Pages (~10 minut)

1. Založte si účet na **dash.cloudflare.com** (zdarma, stačí email).
2. V levém menu **Workers & Pages** → **Create** → záložka **Pages** → **Connect to Git**.
3. Povolte Cloudflare přístup ke GitHubu a vyberte repozitář `goodgood-web`.
4. V nastavení buildu vyplňte:
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`
5. **Save and Deploy**. Za minutu až dvě poběží web na adrese typu
   `goodgood-web.pages.dev` — otevřete a zkontrolujte, že vypadá správně.

## KROK 3 — Napojit doménu goodgood.cz (~15 minut + čekání)

Cloudflare potřebuje spravovat DNS domény (doména samotná zůstává koupená u Active24!):

1. V Cloudflare: **Add a domain** (na hlavní stránce dashboardu) → zadejte `goodgood.cz` → plán **Free**.
2. Cloudflare ukáže dvojici **jmenných serverů** (nameservers), např.
   `xxx.ns.cloudflare.com` a `yyy.ns.cloudflare.com`. Nechte si stránku otevřenou.
3. Přihlaste se do **Active24** → správa domény goodgood.cz → **DNS / jmenné servery**
   → zvolte **vlastní jmenné servery** a zadejte ty dva od Cloudflare. Uložte.
4. Změna se projeví během pár minut až hodin (výjimečně do 24 h). Cloudflare pošle
   email „goodgood.cz is now active", až to bude.
5. Potom v Cloudflare: **Workers & Pages** → projekt `goodgood-web` →
   **Custom domains** → **Set up a custom domain** → `goodgood.cz` (potvrdit),
   a pak totéž ještě jednou pro `www.goodgood.cz`. DNS záznamy se vytvoří samy.
6. Hotovo — web běží na https://goodgood.cz s automatickým certifikátem.

## KROK 4 — Přihlašování do adminu (~15 minut, jednorázově)

Admin na goodgood.cz/admin se přihlašuje přes váš GitHub. Propojení zajistí
malá pomocná služba (běží zdarma na vašem Cloudflare účtu):

1. Otevřete https://github.com/sveltia/sveltia-cms-auth a klikněte na tlačítko
   **Deploy to Cloudflare Workers** v návodu (README). Potvrďte nasazení na svůj účet.
2. Po nasazení dostanete adresu služby, např. `https://sveltia-cms-auth.NECO.workers.dev`
   — **zkopírujte si ji**.
3. Na GitHubu: **Settings** (vašeho účtu) → **Developer settings** → **OAuth Apps**
   → **New OAuth App**:
   - Application name: `GOODGOOD Admin`
   - Homepage URL: `https://goodgood.cz`
   - Authorization callback URL: adresa z bodu 2 + `/callback`
     (např. `https://sveltia-cms-auth.NECO.workers.dev/callback`)
   - **Register application** → na další stránce **Generate a new client secret**.
   - Uvidíte **Client ID** a **Client secret** — nechte otevřené.
4. V Cloudflare: **Workers & Pages** → worker `sveltia-cms-auth` → **Settings** →
   **Variables and Secrets** → přidejte:
   - `GITHUB_CLIENT_ID` = Client ID z bodu 3
   - `GITHUB_CLIENT_SECRET` = Client secret z bodu 3 (typ Secret)
   - `ALLOWED_DOMAINS` = `goodgood.cz` (povolí přihlášení jen z vašeho webu)
   Uložte (worker se sám znovu nasadí).
5. V repozitáři na GitHubu otevřete soubor **admin/config.yml** (tužka = Edit) a upravte
   dva řádky nahoře:
   - `repo:` → `VASE-UZIVATELSKE-JMENO/goodgood-web`
   - `base_url:` → adresa workeru z bodu 2
   **Commit changes** — web se sám přestaví.
6. Otevřete **https://goodgood.cz/admin**, přihlaste se GitHubem — a máte admin.

## KROK 5 — Naplnit obsah přes admin

1. V adminu → **Archiv akcí** → otevřete akci → **Fotogalerie** → nahrajte fotky → **Publish**.
2. **Stránky a nastavení → About Us** → nahrajte dvě fotky vpravo → Publish.
3. **Stránky a nastavení → Nastavení webu** → vyplňte **Adresa Substack publikace**
   (např. `https://goodgood.substack.com`) → Publish. Tím se formuláře napojí
   na newsletter: člověk zadá email, potvrdí na Substacku a je v adresáři.
4. Každá změna se na webu projeví do 1–2 minut (Cloudflare web automaticky přestaví).

## KROK 6 — Substack: import stávajících odběratelů

1. Přihlaste se do Substacku (až to půjde) → **Settings → Subscribers → Import**.
2. Nahrajte soubor `substack-import.csv` (máte ode mě — 90 přihlášených kontaktů).

## KROK 7 — Úklid po Wixu

1. Až goodgood.cz pojede z Cloudflare, ve Wixu už nic rušit nemusíte — placený tarif
   je ukončen a doména se od Wixu odpojila změnou jmenných serverů.
2. Zkontrolujte, že na goodgood.cz funguje: video na hlavní stránce, menu, archiv
   s fotkami, about us, formulář (zadejte svůj email a ověřte, že se otevře Substack).

---

### Kdyby něco nefungovalo
- **Web po nasazení bez stylů / bez fotek** → napište mi, pošlu opravu.
- **Admin hlásí chybu přihlášení** → zkontrolujte krok 4 (Client ID/Secret a callback adresu).
- **Doména nenaběhla do 24 h** → zkontrolujte jmenné servery v Active24 (krok 3.3).
