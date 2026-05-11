import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Do you like Java? ");
        String answer = scanner.nextLine();

        if (answer.equals("yes")) {
            System.out.println("Great. You are in the right place.");
        } else if (answer.equals("maybe")) {
            System.out.println("That is fair. Keep trying it.");
        } else {
            System.out.println("No problem. You can still learn a lot.");
        }

        scanner.close();
    }
}
