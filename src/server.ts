import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { BannerServeces } from './app/banner/banner.servicces';
import { Server } from 'http';

const port = config.PORT;
let server: Server;

async function main() {
  try {
    // Connect to the database
    await mongoose.connect(config.DataBase_Url as string);
    
    // Initialize banner services
    await BannerServeces.createBanner();
    
    // Start the server
    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1); // Exit the process if the server fails to start
  }
}

// Call the main function
main();

// Handle unexpected promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  // Optionally shut down the server gracefully
  if (server) {
    server.close(() => {
      console.log('Server closed due to unhandled promise rejection.');
      process.exit(1); // Exit with failure code
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions globally
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);

  // Optionally shut down the server gracefully
  if (server) {
    server.close(() => {
      console.log('Server closed due to uncaught exception.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});