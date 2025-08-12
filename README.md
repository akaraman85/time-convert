# Unix Timestamp Converter

A modern web application built with Next.js that converts Unix timestamps (epoch time) to human-readable dates in any timezone around the world.

## Features

- **Unix Timestamp Conversion**: Convert both seconds and milliseconds timestamps
- **Local Timezone Detection**: Automatically detects and displays your local timezone
- **Global Timezone Support**: Convert to any timezone worldwide
- **Real-time Current Time**: Shows current Unix timestamp updating every second
- **Relative Time Display**: Shows how long ago or in the future the timestamp is
- **Modern UI**: Beautiful, responsive design with gradient backgrounds
- **ISO Format Support**: Displays timestamps in ISO 8601 format

## Getting Started

### Prerequisites

- Node.js 16.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd time-convert
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy automatically

## Usage

1. Enter a Unix timestamp (in seconds or milliseconds)
2. Select a target timezone from the dropdown
3. Click "Convert Timestamp" to see the results
4. View the converted time in your local timezone, selected timezone, and UTC

## Technologies Used

- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **date-fns**: Modern JavaScript date utility library
- **date-fns-tz**: Timezone support for date-fns
- **CSS3**: Modern styling with gradients and animations

## License

ISC
