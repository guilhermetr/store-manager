cd Authentication/AuthenticationAPI
dotnet ef database update
cd ../..

cd Products/ProductsAPI
dotnet ef database update
cd ../..

cd Orders/OrdersAPI
dotnet ef database update
cd ../..

cd Logging/LoggingAPI
dotnet ef database update
cd ../..
