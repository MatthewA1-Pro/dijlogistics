
import { Rate, ServiceCategory } from './types';

export const WHATSAPP_LINK = "https://wa.me/50769491531?text=Hola%20DIJ%20Logistics,%20quiero%20información%20sobre%20un%20envío";

export const SERVICES_DATA: ServiceCategory[] = [
  {
    title: "Rutas desde Miami (Tax-Free Hub)",
    rates: [
      {
        origin: "Miami",
        destination: "Panamá",
        type: "Aéreo",
        price: "2.50",
        unit: "Libra",
        note: "TODO INCLUIDO",
        flags: ["🇺🇸", "🇵🇦"]
      },
      {
        origin: "Miami",
        destination: "Panamá",
        type: "Marítimo",
        price: "15.00",
        unit: "Pie Cúbico",
        note: "Salidas Semanales",
        flags: ["🇺🇸", "🇵🇦"]
      },
      {
        origin: "Miami",
        destination: "Venezuela",
        type: "Aéreo",
        price: "6.50",
        unit: "Libra",
        note: "Puerta a Puerta",
        flags: ["🇺🇸", "🇻🇪"]
      },
      {
        origin: "Miami",
        destination: "Venezuela",
        type: "Marítimo",
        price: "22.00",
        unit: "Pie Cúbico",
        note: "Mínimo 10 ft³",
        flags: ["🇺🇸", "🇻🇪"]
      }
    ]
  },
  {
    title: "Logística desde China (Yiwu / Guangzhou)",
    rates: [
      {
        origin: "China",
        destination: "Panamá",
        type: "Aéreo",
        price: "9.50",
        unit: "Libra",
        note: "Courier Express",
        flags: ["🇨🇳", "🇵🇦"]
      },
      {
        origin: "China",
        destination: "Panamá",
        type: "Marítimo",
        price: "14.00",
        unit: "Pie Cúbico",
        note: "Consolidado LCL",
        flags: ["🇨🇳", "🇵🇦"]
      },
      {
        origin: "China",
        destination: "Venezuela",
        type: "Aéreo",
        price: "12.50",
        unit: "Libra",
        note: "Vuelo Directo",
        flags: ["🇨🇳", "🇻🇪"]
      },
      {
        origin: "China",
        destination: "Venezuela",
        type: "Marítimo",
        price: "18.50",
        unit: "Pie Cúbico",
        note: "Carga Segura",
        flags: ["🇨🇳", "🇻🇪"]
      }
    ]
  }
];

export const FAQ_DATA = [
  {
    q: "¿Cómo funciona el casillero gratis en Miami de DIJ Logistics?",
    a: "Nuestro casillero en Miami está ubicado en una zona libre de impuestos (Tax-Free). Al registrarte, te damos una dirección física para que envíes tus compras de Amazon o eBay. No cobramos mensualidad, solo pagas por el peso de lo que traigas a Panamá o Venezuela."
  },
  {
    q: "¿Qué tipo de mercancía puedo importar de China con DIJ Logistics?",
    a: "Gestionamos importaciones de maquinaria pesada, repuestos industriales, hardware tecnológico y mercancía retail desde Yiwu y Guangzhou. Ofrecemos servicios LCL (carga consolidada) y FCL (contenedor completo) con asesoría aduanal incluida."
  },
  {
    q: "¿Hacen envíos puerta a puerta a Venezuela desde USA?",
    a: "Sí, contamos con un servicio especializado puerta a puerta hacia Venezuela. Puedes enviar vía aérea para rapidez (aprox. 5-7 días) o vía marítima para cargas más pesadas y voluminosas (aprox. 3-4 semanas) a ciudades como Caracas, Maracaibo y Valencia."
  },
  {
    q: "¿Cuáles son las tarifas para envíos de Miami a Panamá?",
    a: "Nuestra tarifa aérea estándar para Panamá es de $2.50 por libra, bajo la modalidad todo incluido (flete, manejo y entrega básica). Para cargas grandes, el servicio marítimo tiene un costo de $15.00 por pie cúbico, ideal para mobiliario o equipos industriales."
  }
];
