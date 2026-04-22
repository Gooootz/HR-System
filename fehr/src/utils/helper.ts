import { ToWords } from "to-words";

// this is for the OR number
export const generateOrNumber = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

// this is for the CR number
export const generateCrNumber = () => {
  const currentYear = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `CR${currentYear}-${randomNumber}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    // style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};


export const convertAmountToWords = (amount: number) => {
    const toWords = new ToWords({
      localeCode: "en-PH",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
          name: "Peso",
          plural: "Pesos",
          symbol: "₱",
          fractionalUnit: {
            name: "Centavo",
            plural: "Centavos",
            symbol: "",
          },
        },
      },
    });

    return toWords
      .convert(amount)
      .replace("dollars", "pesos")
      .replace("cent", "centavo")
      .toLowerCase();
  };

  //this is for the apiURL
  export const apiURL =
  window.location.host === "localhost:5173"
    ? "http://localhost:5206"
    : "https://odeldevhrapi.azurewebsites.net";