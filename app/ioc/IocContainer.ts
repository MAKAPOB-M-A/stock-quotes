import {DataSource} from "../data/DataSource";
import {StubDataSource} from "../data/impl/StubDataSource";
import {ExchangeDataSource} from "../data/impl/ExchangeDataSource";

interface IServiceProvider {
    register<T>(serviceName: string, serviceType: { new(): T }): void;
    registerFactory<T>(serviceName: string, factoryFn: () => T): void;
    registerValue<T>(serviceName: string, value: T): void;
    resolve<T>(serviceName: string): T | undefined;
}

class IoCContainer implements IServiceProvider {
    private services: Record<string, any> = {};

    /**
     * Регистрируем класс сервиса.
     */
    public register<T>(serviceName: string, serviceType: { new(): T }): void {
        if (this.services.hasOwnProperty(serviceName)) {
            throw new Error(`Сервис "${serviceName}" уже зарегистрирован.`);
        }
        this.services[serviceName] = new serviceType();
    }

    /**
     * Регистрируем фабричную функцию для создания сервиса.
     */
    public registerFactory<T>(serviceName: string, factoryFn: () => T): void {
        if (this.services.hasOwnProperty(serviceName)) {
            throw new Error(`Фабрика для сервиса "${serviceName}" уже зарегистрирована.`);
        }
        this.services[serviceName] = factoryFn;
    }

    /**
     * Регистрируем конкретное значение.
     */
    public registerValue<T>(serviceName: string, value: T): void {
        if (this.services.hasOwnProperty(serviceName)) {
            throw new Error(`Значение для сервиса "${serviceName}" уже зарегистрировано.`);
        }
        this.services[serviceName] = value;
    }

    /**
     * Возвращает зарегистрированную услугу.
     */
    public resolve<T>(serviceName: string): T {
        const resolved = this.services[serviceName];
        if (typeof resolved === 'function') {
            return resolved(); // Если это фабрика, выполняем её
        }
        if (resolved === undefined) {
            throw new Error(`Не найден сервис "${serviceName}".`);
        }
        return resolved as T;
    }
}

const container = new IoCContainer()

switch (process.env.DATA_SOURCE) {
    case 'EXCHANGE':
        container.register("DataSource", ExchangeDataSource);
        break
    case 'STUB':
        container.register("DataSource", StubDataSource)
        break
    default:
        container.register("DataSource", StubDataSource);
}

export default container;
