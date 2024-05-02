export const generic = {
  number: {
    toDecimal(number) {
      try {
        try {
          // Replace commas with dots and parse the number
          number = parseFloat(number.toString().replace(",", "."));
        } catch (err) {
          console.log("Error parsing number in toDecimal()");
          return null;
        }

        // Check if the input is a valid number
        if (isNaN(number)) {
          return null;
        }

        // Round the number to two decimal places
        const roundedNumber = Number(number.toFixed(2));

        // Convert the number to a string with two decimal places using a custom locale
        const formattedNumber = roundedNumber.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return formattedNumber;
      } catch (err) {
        console.log(err);
      }
    },
  },
  misc: {
    isFile: (variable) => {
      return variable instanceof File;
    },
    random: (min = 0, max = 100) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    code: (size, text) => {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset.charAt(randomIndex);
      }
      return text ? text.toUpperCase() + code : code;
    },
  },
};
