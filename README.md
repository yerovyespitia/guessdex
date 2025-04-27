# Guessdex - A Pokémon Guessing Game

Guessdex is an interactive web game where players test their Pokémon knowledge by trying to identify Pokémon from their silhouettes. Similar to the "Who's that Pokémon?" segments from the anime series, players are presented with a darkened silhouette and must guess the correct Pokémon name.

## Features

- Silhouette-based Pokémon guessing gameplay
- Score tracking system
- Hints system
- Feedback after each guess
- Responsive design for both desktop and mobile

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Query for API management
- React Router for navigation

### Backend

- Bun
- Socket.io

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install root dependencies
   bun install

   # Install client dependencies
   cd client
   bun install
   ```

3. Start development servers:

   ```bash
   # Start backend server
   bun dev

   # In a new terminal, start frontend server
   cd client
   bun dev
   ```
