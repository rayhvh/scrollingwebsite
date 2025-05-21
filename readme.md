# Scrolling Platformer Website Idea

This project describes a concept for a personal website about Raymond. The site combines an interactive 2D platformer with a traditional scrolling webpage. As visitors read about Raymond, a little character automatically walks, runs, and climbs through a side-scrolling level filled with obstacles and ladders.

## Gameplay Interaction
- The platformer character moves at a constant pace relative to the user's scroll position.
- If the user scrolls too quickly, the character hits the top of the viewing frame and "dies."
- If the user scrolls too slowly, the character falls to the bottom and also "dies."
- The goal is for the user to keep the character within the frame by scrolling at the right time, so the character can avoid dangers and continue forward.

## Obstacles and Challenges
- Horizontal obstacles that require jumping.
- Vertical obstacles like ladders that must be climbed.
- Timing the scroll to line up with the character's movement lets the user help the character survive the hazards.

## Purpose
This website is intended to be a fun, gamified way to introduce Raymond. The scroll-based platformer keeps readers engaged as they learn more about him while guiding the character safely through the level.

## Technology Stack

The prototype uses the following tools:

- **React** with **Vite** for a fast development environment.
- **TypeScript** for type safety.
- **PixiJS** to render the 2D canvas elements.
- **GSAP ScrollTrigger** to sync scrolling with animations.
- **Tailwind CSS** for utility‑first styling.

These choices keep the code lightweight and easy to extend as the platformer grows more complex.

## Getting Started

1. Install the dependencies (requires Node.js):

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

The generated site will appear in the `dist` folder.
