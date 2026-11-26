package com.yourshop.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.SQLException;

public class DBConfig {
    private static final HikariDataSource dataSource;

    static {
        // ignoreIfMissing() ensures production won't crash when no .env file exists
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        String dbUrl = getEnv("DB_URL", dotenv);
        String dbUser = getEnv("DB_USER", dotenv);
        String dbPass = getEnv("DB_PASSWORD", dotenv);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(dbUrl);
        config.setUsername(dbUser);
        config.setPassword(dbPass);
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);

        dataSource = new HikariDataSource(config);
    }

    private static String getEnv(String key, Dotenv dotenv) {
        String value = System.getenv(key);
        return (value != null && !value.isBlank()) ? value : dotenv.get(key);
    }

    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}