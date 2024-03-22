cd Services/Authentication/AuthenticationAPI
dotnet ef database update
cd ../../..

cd Services/Products/ProductsAPI
dotnet ef database update
cd ../../..

cd Services/Orders/OrdersAPI
dotnet ef database update
cd ../../..

cd Services/Logging/LoggingAPI
dotnet ef database update
cd ../../..
