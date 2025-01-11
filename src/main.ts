import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
import { AllExceptionsFilter } from './common/filter/all_exceptions_filter/all_exceptions_filter.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  app.useGlobalFilters(new AllExceptionsFilter());

  console.log(`hi: ${process.cwd()}`);

  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }

  const adminConfig: ServiceAccount = {
    "projectId": "atlas-69393",
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCOEVPpiyhSOahF\n+O2oSLbxGd+9cd4DGTRBid0lIiyx1tkOneYDpqi1xSm1WdgyXsSAtl2X8gG39WWa\nZGI20/3FNbvjvTtA+HGqlSnUHFup4g4JKrTpg7A9PzVlbsC1GRkXRsbIzC5MqRa0\npTTA47nfosUAocLFP8kPQyL1Oc43Qf3+n0txcd7zg3hgwLaOIYQBUc/kGfzfPt90\n2MS3iQFEv15eJHpjNPWMtjZMCBFB/2R+U+H5G4G5fFf+ipzOVGx6sttLnLKoll3B\nEy5zk9ys2csRrrvAG8whXpEHd6vQ5D9/731mx5nGrdNS1yP2eEPA4d1BgRtGqTwV\njy/WEn6dAgMBAAECggEANyp6W5dKTneOJLGvU2f9Be1mqLE1JR3d4U8v/PHiyiHk\nAl2FCkjmfUL02bNsFM8g3dwyxsRWL4FOdV/ilWjHQ5OEhMAf6LAwry0h43gpjfO2\nQJABVSXqQzYuvVb+5LO8vwGgQiurFOCZ7Qazz+z96d3SQtcNgzusDs2invfV4DWf\nVewUb8J+f1tjyVdrcWv02e+luc6ymAPD8EYVxTaIdIuADifkmJVuDIrDLsBc7RrN\np2jyI2DcqpP8vLOjWLJx7rUoVxDaEsuF7Pbej/i8EMy0CaZRtUJezWxEWbgkDBtY\nY0x04djLElUfgX63OwenfNFReif21hqcJ1/Xa3GPDwKBgQDA1hFCDrjbyfATGoPG\n6XNiNs5sZh0pAwiK/SFk+2wyUyjysjLejCVeJrsh9c12hEusaT2te/NFGhjY0qvG\n6e7/nnBun7XYgfXeNeQmw9c1WgBxgPzyAUSuDHKlxxeemuvmSjMl7rBqM4pUhdGX\ngDUMWUCMWDotOcwMqDduX4bROwKBgQC8mihxHG/81NhwEOALJIH3yJY7yaGLGPP+\nKqE/YV9cTKl46yIc/+rc2syKsngm5AgUqwxXV4eM6Ij1134KzpWNw3oWo99Q7/j4\nNoJ5PCuHhm0zk623I7tJhVdWP/Pp+tddAs5NGDyOzVN4iaFxqnpMFmV2wq8r/wSB\nYJPJvTvyBwKBgQC//eIc5M+EdOAEBSgiiRgKNwr6vghWZuDAkRoIkpK84DMqv+UJ\n0nr57JHwU+yHDVzSgc2YxooEyODoL4g7eXotIrBKU9UXhP0ointnZSEFy2AZohU1\nVbHtoBMdnsWTcidgl4upPqaCdmJJmRp+PnWSn+I2WTlDAgJ4r5rQ12dBNQKBgDUn\n4bQXhrykpKfZKbwaOwNCJo2NQ5l3m/ULwMyjPgQ+mxk4dDHmMySyCiohKNoVNO3W\nU7EeO1cMhuV7KcwT83S0HmnZH+yo5evXOSjAO6iDy61YtwJB8NxE15u4hJ9yklZl\nnw19gjvhROBZMgZePP/K5Cf3sPVed7+bH6whSI7rAoGBAKbYRurqqf10+vQj9E2y\nhAhFqOi/bZADnlPcc+qAAQz2i9S2PO3MwwqQYVCYUJnVXEXlfZcEMGPD34PfeENn\nYwlO4kD4DyoOpq9znxD7QE70DAI4upBxwgji12bDTry5OBLWP1clwd4YghaAi7ms\nkoQaiqajAGvudx8X8QY2dOnl\n-----END PRIVATE KEY-----\n"
      .replace(/\\n/g, '\n'),
    "clientEmail": "firebase-adminsdk-m3653@atlas-69393.iam.gserviceaccount.com",
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    // databaseURL: "https://xxxxx.firebaseio.com",
  });
  app.enableCors();


  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
