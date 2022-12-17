exports.findBookQuery = (request) => {
        const {
            page,
            pageSize,
            search,
            ratingFilter,
            categoryFilter,
            authorFilter,
            yearFilter,
            sortName,
            sortAuthor,
            sortYear,
        } = request.query;
        const searchTitle = search ? search : "";
        const yearConfig =
            yearFilter && yearFilter.length > 0 ?
            `AND YEAR('bookfind'.'PublishedDate') in ("${yearFilter.join(`","`)}")`
      : "";
  let sortConfig = [
    sortName && `'bookfind'.'BookName' ` + sortName,
    sortAuthor && `'bookfind'.'Author' ` + sortAuthor,
    sortYear && `'bookfind'.'PublishedDate' ` + sortYear,
  ];
  sortConfig = sortConfig.filter((val) => val);
  let sort = "";
  if (sortConfig.length > 0) {
    sort = "ORDER BY " + sortConfig.join(", ");
  }
  let authorFilerQuery = "";
  if (authorFilter && authorFilter.length > 0) {
    authorFilerQuery = `AND 'bookfind'.'Author' in ("${authorFilter.join(
      `","`
    )}")`;
  }
  const filterByCategory = categoryFilter && categoryFilter.length > 0;
  const categoryFilterQuery = filterByCategory
    ? `WHERE 'bookcategories->category'.'CategoryID' in (${categoryFilter.join(
        ","
      )}) group by 'book'.'BookID' having count('bookcategories->category'.'CategoryID') >= ${
        categoryFilter.length
      }`
    : "";
  console.log(categoryFilterQuery);
  const query = `SELECT 'bookfind'.* from
                    (SELECT 'bookFilter'.*,
                        group_concat('bookcategories'.'CategoryID' separator ",") as 'ListCategoryID',
                        group_concat( 'bookcategories->category'.'CategoryName' separator ",") as 'ListCategoryName'
                    From
                    (SELECT 
                        'book'.*
                    FROM
                    (SELECT 'book'.'BookID',
                            'book'.'BookName',
                            'book'.'Author',
                            'book'.'Series',
                            'book'.'Chapter',
                            'book'.'Description',
                            'book'.'PublishedDate',
                            'book'.'Publisher',
                            'book'.'Price',
                            'book'.'ImageURL'
                    FROM 'book' AS 'book'
                    ) AS 'book'
                    LEFT OUTER JOIN 'bookcategory' AS 'bookcategories' ON 'book'.'BookID' = 'bookcategories'.'BookID'
                    LEFT OUTER JOIN 'category' AS 'bookcategories->category' ON 'bookcategories'.'CategoryID' = 'bookcategories->category'.'CategoryID'

                    -- filter category--
                    -- WHERE 'bookcategories->category'.'CategoryID' in (22,14)
                    -- group by 'book'.'BookID'
                    -- having count('bookcategories->category'.'CategoryID') >= 2
                    ${categoryFilterQuery}
                    ${filterByCategory ? " " : `group by 'book'.'BookID'`}

                    -- order by 'book'.'BookID' asc , 'bookcategories'.'CategoryID' asc --
                    ) as 'bookFilter' 
                    LEFT OUTER JOIN 'bookcategory' AS 'bookcategories' ON 'bookFilter'.'BookID' = 'bookcategories'.'BookID'
                    LEFT OUTER JOIN 'category' AS 'bookcategories->category' ON 'bookcategories'.'CategoryID' = 'bookcategories->category'.'CategoryID'
                    group by 'bookFilter'.'BookID')
                    as 'bookfind'
                    WHERE  ('bookfind'.'Author' LIKE "%${searchTitle}%"
                    OR  'bookfind'.'BookName' LIKE "%${searchTitle}%"
                    OR 'bookfind'.'Publisher' LIKE "%${searchTitle}%"
                    OR 'bookfind'.'ListCategoryName' LIKE "%${searchTitle}%")
                    ${yearConfig}
                    ${authorFilerQuery}
                    ${sort}
                    LIMIT ${
                      (parseInt(page) - 1) * pageSize
                    },${pageSize}`.replaceAll(`'`, "`");
  const countQuery = `SELECT COUNT('bookfind'.'BookID') as Total from
                    (SELECT 'bookFilter'.*,
                        group_concat('bookcategories'.'CategoryID' separator ",") as 'ListCategoryID',
                        group_concat( 'bookcategories->category'.'CategoryName' separator ",") as 'ListCategoryName'
                    From
                    (SELECT 
                        'book'.*
                    FROM
                    (SELECT 'book'.'BookID',
                            'book'.'BookName',
                            'book'.'Author',
                            'book'.'Series',
                            'book'.'Chapter',
                            'book'.'Description',
                            'book'.'PublishedDate',
                            'book'.'Publisher',
                            'book'.'Price',
                            'book'.'ImageURL'
                    FROM 'book' AS 'book'
                    ) AS 'book'
                    LEFT OUTER JOIN 'bookcategory' AS 'bookcategories' ON 'book'.'BookID' = 'bookcategories'.'BookID'
                    LEFT OUTER JOIN 'category' AS 'bookcategories->category' ON 'bookcategories'.'CategoryID' = 'bookcategories->category'.'CategoryID'

                    -- filter category--
                    -- WHERE 'bookcategories->category'.'CategoryID' in (22,14)
                    -- group by 'book'.'BookID'
                    -- having count('bookcategories->category'.'CategoryID') >= 2
                    ${categoryFilterQuery}
                    ${filterByCategory ? " " : `group by 'book'.'BookID'`}

                    -- order by 'book'.'BookID' asc , 'bookcategories'.'CategoryID' asc --
                    ) as 'bookFilter' 
                    LEFT OUTER JOIN 'bookcategory' AS 'bookcategories' ON 'bookFilter'.'BookID' = 'bookcategories'.'BookID'
                    LEFT OUTER JOIN 'category' AS 'bookcategories->category' ON 'bookcategories'.'CategoryID' = 'bookcategories->category'.'CategoryID'
                    group by 'bookFilter'.'BookID')
                    as 'bookfind'
                    WHERE  ('bookfind'.'Author' LIKE "%${searchTitle}%"
                    OR  'bookfind'.'BookName' LIKE "%${searchTitle}%"
                    OR 'bookfind'.'Publisher' LIKE "%${searchTitle}%"
                    OR 'bookfind'.'ListCategoryName' LIKE "%${searchTitle}%")
                    ${yearConfig}
                    ${authorFilerQuery}
                    `.replaceAll(`'`, "`");
  return { query, countQuery };
};