/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                medical: {
                    primary: "#003B73", // Deep Blue
                    secondary: "#008080", // Teal
                    accent: "#00BFFF", // Professional Blue
                    background: "#F8FAFC", // Medical Gray
                    surface: "#FFFFFF",
                    text: "#1E293B",
                    muted: "#64748B",
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
            },
            boxShadow: {
                'medical': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(0, 0, 0, 0.02)',
            }
        },
    },
    plugins: [],
}
