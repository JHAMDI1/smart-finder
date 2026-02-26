package com.smartfinder;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CleanHistory {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/smartfinder?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
        try (Connection conn = DriverManager.getConnection(url, "root", "")) {
            Statement stmt = conn.createStatement();
            int rows = stmt.executeUpdate("DELETE FROM flyway_schema_history WHERE version = '4'");
            System.out.println("Deleted " + rows + " rows from flyway_schema_history");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
