-- RESET DỮ LIỆU ĐỂ CÓ THỂ CHẠY ĐƯỢC TRÊN POSTMAN
UPDATE BookItem SET Status = "available" WHERE BookItemID IN (
  "022c7799-4ae6-4b6e-ab7a-5f3e1021a89d" ,
  "0ccd4bcc-f96c-4e71-875d-4946efa6f255", 
  "9c4cf96b-b863-4248-ac38-dbdad92edf09", 
  "b2e8eba2-9073-4673-98a1-a895b70e118e", 
  "97a07259-071f-429a-a0d9-db7bae584364"
);
DELETE FROM LendingBookList WHERE LendingID="04f1fb26-c1cf-4fdb-94e1-60b48f32be4b";

DELETE FROM LendingList WHERE AccountID = "65013271-8338-48df-beb0-71f53b247831"