package application;

public class Glasses {
	String _id;
	String Name;
	float Price;
	String Size;
	String Colour;
	String Weight;
	String Material;
	String Shape;
	String StartingDateAvailable;
	String EndingDateAvailable;
	String Image;
	String Description;
	boolean Premium_Brand;
	Number Sale_Price;
	String Produced_By;
	
	@Override
	public String toString() {
		return _id + " " + Name;
	}
}
