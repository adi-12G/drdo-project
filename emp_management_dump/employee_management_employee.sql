-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: employee_management
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `pis_number` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `tele_no` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cadre_id` int DEFAULT NULL,
  `designation_id` int DEFAULT NULL,
  `internal_designation_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `user_type` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `is_gazetted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `pis_number` (`pis_number`),
  KEY `cadre_id` (`cadre_id`),
  KEY `designation_id` (`designation_id`),
  KEY `internal_designation_id` (`internal_designation_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`cadre_id`) REFERENCES `cadre` (`cadre_id`),
  CONSTRAINT `employee_ibfk_2` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`designation_id`),
  CONSTRAINT `employee_ibfk_3` FOREIGN KEY (`internal_designation_id`) REFERENCES `internal_designation` (`internal_designation_id`),
  CONSTRAINT `employee_ibfk_4` FOREIGN KEY (`group_id`) REFERENCES `employee_group` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'PIS001','Aditya',NULL,'Tomar','Male',NULL,NULL,NULL,'aditya@example.com',1,1,1,1,NULL,'aditya','password123',1,0,'2026-06-19 17:23:59',0),(2,'PIS002','abc',NULL,'def',NULL,NULL,NULL,NULL,'abcdef@gmail.com',1,1,1,1,NULL,NULL,NULL,1,0,'2026-07-02 13:50:16',0),(3,'PIS004','dakjh',NULL,'djchnkjed',NULL,NULL,NULL,NULL,'abcabc@gmail.com',2,2,2,2,NULL,NULL,NULL,1,0,'2026-07-02 14:23:50',0);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02 22:23:46
