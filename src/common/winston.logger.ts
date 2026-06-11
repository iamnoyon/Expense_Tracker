import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

export function createWinstonLogger(configService: ConfigService) {
  const isProduction = configService.get('NODE_ENV') === 'production';

  return WinstonModule.createLogger({
    level: isProduction ? 'info' : 'debug',
    transports: [
      new winston.transports.Console({
        format: isProduction
          ? winston.format.json()
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('ExpenseTracker', {
                prettyPrint: true,
                colors: true,
              }),
            ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });
}
