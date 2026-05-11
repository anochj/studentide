public class Main {
    static void printBook(String title, String author) {
        System.out.println(title + " by " + author);
    }

    static boolean isAvailable(boolean checkedOut) {
        return !checkedOut;
    }

    public static void main(String[] args) {
        printBook("Learning Java", "Student IDE");
        System.out.println("Available: " + isAvailable(false));
    }
}
