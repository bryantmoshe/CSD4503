module CSD4503 {
	requires javafx.controls;
	requires javafx.graphics;
	requires javafx.fxml;
	requires java.net.http;
	requires com.google.gson;
	requires javafx.base;
	opens application to javafx.graphics, javafx.fxml, com.google.gson;
}
