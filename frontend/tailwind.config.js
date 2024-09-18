/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Puedes agregar colores personalizados aquí si los necesitas
      },
      fontFamily: {
        // Puedes agregar fuentes personalizadas aquí si las necesitas
      },
    },
  },
  plugins: [],
  // Añadimos esto para asegurarnos de que las clases responsive funcionen correctamente
  variants: {
    extend: {
      display: ['responsive'],
      gridTemplateColumns: ['responsive'],
    },
  },
}