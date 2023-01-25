ALTER TABLE `Account`
ADD COLUMN `FullName` varchar(100) DEFAULT NULL;

ALTER TABLE `Account`
  MODIFY `Birthday` datetime DEFAULT NULL;
  
ALTER TABLE `Account`
  MODIFY `Gender` varchar(1) DEFAULT NULL;