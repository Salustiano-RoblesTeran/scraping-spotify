import { chromium } from 'playwright';

const scrapeAmazon = async () => {
  // Lanzar el navegador
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Navegar a la URL
  await page.goto('https://amazon.com/s?k=computers&rh=p_n_deal_type%3A23566065011&language=es&_encoding=UTF8&content-id=amzn1.sym.6afe7900-0834-4d0d-afa0-213431caed72&pd_rd_r=adaea00d-d12f-48a6-9d00-4e0a2d26297e&pd_rd_w=irjTi&pd_rd_wg=Qc70S&pf_rd_p=6afe7900-0834-4d0d-afa0-213431caed72&pf_rd_r=W46FEFW9HHX09S9QHKVD&ref=pd_hp_d_atf_unk');

  // Extraer información de los productos
  const products = await page.$$eval('.s-card-container', (items) =>
    items.map((item) => {
      const title = item.querySelector('h2')?.innerText;
      if (!title) return null;
      const image = item.querySelector('img')?.getAttribute('src');
      const priceWhole = item.querySelector('.a-price-whole')?.innerText;
      const priceFraction = item.querySelector('.a-price-fraction')?.innerText;
      const price = priceWhole && priceFraction ? `${priceWhole}.${priceFraction}` : null;

      return { title, image, price };
    })
  );

  // Filtrar los productos nulos
  const filteredProducts = products.filter((product) => product !== null);

  console.log(filteredProducts);

  // Cerrar el navegador
  await browser.close();
};

// Ejecutar la función de raspado
scrapeAmazon().catch((error) => console.error('Error:', error));
