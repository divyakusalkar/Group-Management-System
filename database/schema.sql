-- ============================================
-- Group Management System - Database Schema
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS group_management_db;
USE group_management_db;

-- Create the Group table
CREATE TABLE IF NOT EXISTS `group` (
    group_id    INT AUTO_INCREMENT PRIMARY KEY,
    group_name  VARCHAR(255) NOT NULL UNIQUE,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO `group` (group_name, is_active) VALUES
    ('Persian Darbar', TRUE),
    ('Royal Kitchen', TRUE),
    ('Urban Bites', TRUE),
    ('Spice Garden', FALSE),
    ('Golden Plate', TRUE);
