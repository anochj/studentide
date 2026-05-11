import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("What is your name? ");
        String name = scanner.nextLine();

        System.out.print("What do you want to build? ");
        String goal = scanner.nextLine();

        System.out.println("Hello, " + name + ".");
        System.out.println("One day, you want to build " + goal + ".");

        scanner.close();
    }
}
