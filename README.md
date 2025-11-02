# Lucky Mini Game - Trò Chơi May Mắn

A beautiful Next.js application featuring an interactive lucky wheel game with Vietnamese language support.

## Features

- 🎡 Interactive spinning wheel with SVG visualization
- 🎯 Customizable entries (one per line)
- 🏆 Multiple winner selection
- ✨ Winning animation with confetti effect
- 📊 Leaderboard display
- 🎨 Beautiful color scheme matching brand guidelines

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. Enter your list of participants in the textarea (one per line)
2. Specify the number of winners
3. Click "QUAY SỐ MAY MẮN" button to spin the wheel
4. Watch the animation and see the winners displayed in the leaderboard

## Color Palette

The app uses the following color scheme:

- **Primary Blue**: #0074C8
- **Sky Blue**: #5BB9F0
- **Gold**: #FFD700
- **Soft Green**: #A5D6A7
- **Coral Red**: #FF6F61
- **Navy Blue**: #004B84
- **Cool Gray**: #E6ECF2

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

## Project Structure

```
duuan/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── lucky-wheel.tsx  # Main game component
│   └── ui/              # shadcn/ui components
├── lib/
│   └── utils.ts         # Utility functions
└── package.json
```

## License

MIT
