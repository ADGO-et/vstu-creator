/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{ts,tsx}",
	  "./components/**/*.{ts,tsx}",
	  "./app/**/*.{ts,tsx}",
	  "./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
    	container: {
    		center: 'true',
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	fontFamily: {
    		featherBold: 'Feather Bold'
    	},
    	extend: {
    		backgroundImage: {
    			'gradient-to-b-custom': 'linear-gradient(to bottom,rgba(217,217,217,1),rgba(255,255,255,1) )'
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
				tertiary: '#008DBC',
    			customGreen: 'rgba(88,204,2,0.35)',
    			link: '#0D0DDE',
    			grey: 'rgba(217,217,217,1)',
    			customPurple: 'rgba(153,24,251,1)',
    			customOrange: 'rgba(255,165,0,1)',
    			customBlue: 'rgba(24,160,251,1)',
    			customGray: 'rgba(121,119,119,1)',
    			verylightGreen: '#f2ffef',
    			lightGreen: '#9ACD32',
    			green: '#58CC02',
    			lightOrange: '#FFAE42',
    			orange: '#FFA500',
    			graytextColor: '#696984',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			floatUpDown: {
    				'0%, 100%': {
    					transform: 'translateY(-5px)'
    				},
    				'50%': {
    					transform: 'translateY(5px)'
    				}
    			},
    			floatLeftRight: {
    				'0%, 100%': {
    					transform: 'translateX(-5px)'
    				},
    				'50%': {
    					transform: 'translateX(5px)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'float-up-down': 'floatUpDown 3s ease-in-out infinite',
    			'float-left-right': 'floatLeftRight 3s ease-in-out infinite'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
  };
  
  
  