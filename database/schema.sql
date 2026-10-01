-- ============================================================
-- BHARAT — BUILD THE CIVILIZATION
-- PART 4: AIVEN MYSQL DATABASE SCHEMA
-- Compatible with MySQL 8.0+ / Aiven MySQL Cloud Database
-- ============================================================

CREATE DATABASE IF NOT EXISTS bharat_db;
USE bharat_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PLAYER PROFILES TABLE
CREATE TABLE IF NOT EXISTS player_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  civilization_name VARCHAR(100) NOT NULL DEFAULT 'My Bharat',
  current_era VARCHAR(100) NOT NULL DEFAULT 'early_settlements',
  civilization_level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  xp_to_next_level INT NOT NULL DEFAULT 100,
  population INT NOT NULL DEFAULT 3,
  population_capacity INT NOT NULL DEFAULT 5,
  max_storage INT NOT NULL DEFAULT 500,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PLAYER RESOURCES TABLE
CREATE TABLE IF NOT EXISTS player_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  food INT NOT NULL DEFAULT 120,
  water INT NOT NULL DEFAULT 80,
  wood INT NOT NULL DEFAULT 60,
  stone INT NOT NULL DEFAULT 40,
  metal INT NOT NULL DEFAULT 10,
  knowledge INT NOT NULL DEFAULT 10,
  culture INT NOT NULL DEFAULT 5,
  trade INT NOT NULL DEFAULT 0,
  stored_food INT NOT NULL DEFAULT 0,
  stored_water INT NOT NULL DEFAULT 0,
  stored_knowledge INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PLAYER BUILDINGS TABLE
CREATE TABLE IF NOT EXISTS player_buildings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  building_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_building (user_id, building_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PLAYER TECHNOLOGIES TABLE
CREATE TABLE IF NOT EXISTS player_technologies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  technology_id VARCHAR(50) NOT NULL,
  unlocked BOOLEAN NOT NULL DEFAULT TRUE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_tech (user_id, technology_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PLAYER MISSIONS TABLE
CREATE TABLE IF NOT EXISTS player_missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mission_id VARCHAR(50) NOT NULL,
  progress INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  claimed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY unique_user_mission (user_id, mission_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PLAYER ARTIFACTS TABLE
CREATE TABLE IF NOT EXISTS player_artifacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  artifact_id VARCHAR(50) NOT NULL,
  discovered_at_era VARCHAR(100) DEFAULT NULL,
  discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_artifact (user_id, artifact_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. PLAYER DISCOVERIES TABLE
CREATE TABLE IF NOT EXISTS player_discoveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  discovery_id VARCHAR(50) NOT NULL,
  discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_discovery (user_id, discovery_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PLAYER HISTORICAL EVENTS TABLE
CREATE TABLE IF NOT EXISTS player_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id VARCHAR(50) NOT NULL,
  choice_id VARCHAR(50) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_event (user_id, event_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PLAYER GENERAL PROGRESS & JOURNAL
CREATE TABLE IF NOT EXISTS player_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  active_era_id VARCHAR(50) NOT NULL DEFAULT 'early_settlements',
  unlocked_eras_json JSON DEFAULT NULL,
  completed_challenges_json JSON DEFAULT NULL,
  building_slots_json JSON DEFAULT NULL,
  current_objective_title VARCHAR(255) DEFAULT 'Establish your first settlement.',
  current_objective_progress INT DEFAULT 0,
  current_objective_target INT DEFAULT 1,
  gathered_wood INT DEFAULT 0,
  gathered_stone INT DEFAULT 0,
  gathered_food INT DEFAULT 0,
  gathered_water INT DEFAULT 0,
  journal_entries_json MEDIUMTEXT DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ACHIEVEMENTS TABLE (STATIC DEFINITIONS)
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  xp_reward INT NOT NULL DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. PLAYER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS player_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  achievement_code VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_ach (user_id, achievement_code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- MINIMAL SEED DATA FOR ACHIEVEMENTS
-- ============================================================
INSERT IGNORE INTO achievements (code, title, description, category, icon_name, xp_reward) VALUES
('first_shelter', 'First Hearth', 'Construct your very first mud-brick settlement hut.', 'building', 'Home', 50),
('river_scout', 'River Explorer', 'Complete your first expedition along the sacred river banks.', 'exploration', 'Compass', 40),
('fire_master', 'Spark of Ingenuity', 'Master fire technology to safeguard and warm the settlement.', 'technology', 'Flame', 60),
('harappan_dawn', 'Urban Architect', 'Advance civilization to the Indus & Harappan Civilization era.', 'progression', 'Landmark', 100),
('first_relic', 'Guardian of Antiquity', 'Uncover your first historical artifact for the civilization museum.', 'museum', 'Award', 75);
