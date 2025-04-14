import { Customer } from 'src/customers/entities/customer.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'inventory',
  entities: [Customer, Users],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
};

export class DatabaseService {
  private static dataSource: DataSource | null = null;

  static async connect(): Promise<DataSource> {
    try {
      if (!this.dataSource) {
        this.dataSource = new DataSource(databaseConfig);

        if (!this.dataSource.isInitialized) {
          await this.dataSource.initialize();
          console.log(
            '✅ Database connection has been established successfully.',
          );
        }
      }

      return this.dataSource;
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      if (this.dataSource?.isInitialized) {
        await this.dataSource.destroy();
        this.dataSource = null;
        console.log('Database connection closed.');
      }
    } catch (error) {
      console.error('Error disconnecting from database:', error);
      throw error;
    }
  }
}

// Initialize database connection when the file is imported
DatabaseService.connect()
  .then(() => {
    console.log('Database initialization completed.');
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
