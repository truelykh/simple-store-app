test:
	cd user-service && mvn -B test
	cd ../product-service && mvn -B test
	cd ../order-service && mvn -B test
	cd ../payment-service && mvn -B test
	cd ../notification-service && mvn -B test

frontend-build:
	cd frontend && npm install && npm run build
