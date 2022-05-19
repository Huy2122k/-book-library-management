SELECT `bookfind`.* from
(SELECT `bookFilter`.*,
	group_concat(`bookcategories`.`CategoryID` separator ",") as `ListCategoryID`,
	group_concat( `bookcategories->category`.`CategoryName` separator ",") as `ListCategoryName`
From
(SELECT 
       `book`.*
FROM
  (SELECT `book`.`BookID`,
          `book`.`BookName`,
          `book`.`Author`,
          `book`.`Series`,
          `book`.`Chapter`,
          `book`.`Description`,
          `book`.`PublishedDate`,
          `book`.`Publisher`,
          `book`.`Price`,
          `book`.`ImageURL`
   FROM `book` AS `book`
) AS `book`
LEFT OUTER JOIN `bookcategory` AS `bookcategories` ON `book`.`BookID` = `bookcategories`.`BookID`
LEFT OUTER JOIN `category` AS `bookcategories->category` ON `bookcategories`.`CategoryID` = `bookcategories->category`.`CategoryID`

-- filter category--
-- WHERE `bookcategories->category`.`CategoryID` in (22,14)
-- group by `book`.`BookID`
-- having count(`bookcategories->category`.`CategoryID`) >= 2

-- search category--
-- WHERE `bookcategories->category`.`CategoryName` LIKE "%classic%"-- 
group by `book`.`BookID`
order by `book`.`BookID` asc , `bookcategories`.`CategoryID` asc 
) as `bookFilter` 
LEFT OUTER JOIN `bookcategory` AS `bookcategories` ON `bookFilter`.`BookID` = `bookcategories`.`BookID`
LEFT OUTER JOIN `category` AS `bookcategories->category` ON `bookcategories`.`CategoryID` = `bookcategories->category`.`CategoryID`
group by `bookFilter`.`BookID`)
 as `bookfind`
WHERE  `bookfind`.`Author` LIKE "%%"
OR  `bookfind`.`BookName` LIKE "%%"
OR `bookfind`.`Publisher` LIKE "%%"

group by  `bookfind`.`BookID` 

