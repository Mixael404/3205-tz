import { Logger } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(ConfigService);
    const logger = new Logger();

    app.setGlobalPrefix("api");

    app.enableCors({
        origin: "http://localhost:5173",
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Cats example")
        .setDescription("The cats API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("docs", app, documentFactory, {
        yamlDocumentUrl: "/openapi.yaml",
    });

    const port = config.getOrThrow<number>("PORT");
    const host = config.getOrThrow<string>("HOST");

    logger.log(`Swagger: ${host}/docs`);

    await app.listen(port ?? 3000);
}
bootstrap();
