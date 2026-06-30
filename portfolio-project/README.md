# Space Portfolio 🚀

A modern, immersive, space-themed personal developer portfolio built with React, Three.js, and Tailwind CSS. It features interactive 3D elements, a custom pixel-art loading screen, a playable mini-game (shoot meteorites!), and a sleek glassmorphism design.

## Features

- **Interactive 3D Background**: A beautiful starfield, glowing nebulas, and slowly orbiting planets built with `@react-three/fiber` and `@react-three/drei`.
- **Mouse Parallax**: The camera subtly reacts to your mouse movements, giving the scene an incredible sense of depth.
- **Playable Mini-Game**: Fly a spaceship and hold `F` to shoot lasers at passing meteorites!
- **Customizable Themes**: Change the entire color palette (Neon, Synthwave, Dark), your ship's chassis, and your weapon type from the Settings menu.
- **Scroll-Driven Animations**: Content reveals smoothly as you scroll down the page, utilizing the Intersection Observer API.
- **Glassmorphism Design**: Frosted glass UI elements (`backdrop-filter`) that beautifully complement the space background.
- **Fully Responsive**: Carefully designed to look great on both desktop and mobile devices.

## Tech Stack

- **Framework**: React 18
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Styling**: Tailwind CSS, Vanilla CSS
- **Build Tool**: Vite
- **Icons & Typography**: Custom pixel fonts and 'Inter' body font for optimal readability.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone https://github.com/iXION82/portfolio.git
   cd portfolio/portfolio-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173/` to view the portfolio.

## Structure

- `src/App.tsx`: Main application component, layout, and sections (Hero, About, Skills, Projects, Contact).
- `src/components/SpaceBackground.tsx`: The primary 3D canvas rendering the stars, planets, and lighting.
- `src/components/Spaceship.tsx`: The 3D model and logic for the player's ship.
- `src/components/Meteorites.tsx`: The spawning and destruction logic for the asteroids.
- `src/components/LoadingScreen.tsx`: The custom pixel-art loading screen with progress bar.
- `src/index.css`: Global styles, CSS animations (`scroll-reveal`, `animate-float`), and custom cursors.

## License

This project is open-source and available under the [MIT License](LICENSE). Feel free to use it as inspiration for your own portfolio!
