require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Agrokratis server running on port ${PORT}`);
  logger.info(`Twilio webhook: http://localhost:${PORT}/api/voice`);
  logger.info(`Admin API: http://localhost:${PORT}/api`);
});
